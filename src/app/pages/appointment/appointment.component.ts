import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  CustomerService,
  AvailableSlot,
  ScheduleRequest
} from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';

interface ServiceOption {
  id: number;
  name: string;
  duration: string;
  price?: string;
  selected: boolean;
}

interface GroupedSlots {
  date: string;
  label: string;
  times: string[];
}

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './appointment.component.html'
})
export class AppointmentComponent {
  // Step control
  currentStep = signal(1);
  totalSteps = 3;

  // Step 1 — Barbeiro
  barberId = signal('');
  barberIdError = signal('');
  loadingSlots = signal(false);
  slotsLoaded = signal(false);

  // Step 2 — Data e Horário
  availableSlots: AvailableSlot[] = [];
  groupedSlots = signal<GroupedSlots[]>([]);
  selectedDate = signal('');
  selectedTime = signal('');

  // Step 3 — Serviços (mock list — real integration via barber's values sheet)
  services = signal<ServiceOption[]>([
    { id: 1, name: 'Corte Clássico',    duration: '30 min', price: 'R$ 45',  selected: false },
    { id: 2, name: 'Barba Modelada',    duration: '20 min', price: 'R$ 35',  selected: false },
    { id: 3, name: 'Corte + Barba',     duration: '50 min', price: 'R$ 70',  selected: false },
    { id: 4, name: 'Pigmentação',        duration: '40 min', price: 'R$ 60',  selected: false },
    { id: 5, name: 'Hidratação Capilar', duration: '30 min', price: 'R$ 50',  selected: false },
  ]);

  selectedServices = computed(() => this.services().filter(s => s.selected));

  // Submission
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Day-label map
  private readonly DAY_LABELS: Record<string, string> = {
    '0': 'Dom', '1': 'Seg', '2': 'Ter',
    '3': 'Qua', '4': 'Qui', '5': 'Sex', '6': 'Sáb'
  };

  private readonly MONTH_NAMES = [
    'Jan','Fev','Mar','Abr','Mai','Jun',
    'Jul','Ago','Set','Out','Nov','Dez'
  ];

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) {}

  // ─── Step navigation ──────────────────────────────────────────────────────

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep.set(step);
    }
  }

  canAdvanceStep1 = computed(() =>
    this.slotsLoaded() && this.barberId().trim().length > 0
  );

  canAdvanceStep2 = computed(() =>
    this.selectedDate() !== '' && this.selectedTime() !== ''
  );

  canAdvanceStep3 = computed(() =>
    this.selectedServices().length > 0
  );

  // ─── Step 1: Load barber slots ─────────────────────────────────────────────

  loadAvailableSlots(): void {
    const id = parseInt(this.barberId().trim(), 10);
    if (isNaN(id) || id <= 0) {
      this.barberIdError.set('Informe um ID de barbeiro válido.');
      return;
    }
    this.barberIdError.set('');
    this.loadingSlots.set(true);
    this.slotsLoaded.set(false);

    this.customerService.getAvailableHours(id).subscribe({
      next: (res) => {
        this.availableSlots = res.availableTimes;
        this.groupedSlots.set(this.groupSlots(res.availableTimes));
        this.slotsLoaded.set(true);
        this.loadingSlots.set(false);
      },
      error: () => {
        this.loadingSlots.set(false);
        this.barberIdError.set('Barbeiro não encontrado ou sem horários disponíveis.');
      }
    });
  }

  private groupSlots(slots: AvailableSlot[]): GroupedSlots[] {
    const map = new Map<string, string[]>();
    for (const slot of slots) {
      if (!map.has(slot.date)) map.set(slot.date, []);
      map.get(slot.date)!.push(slot.time);
    }
    return Array.from(map.entries()).map(([date, times]) => ({
      date,
      label: this.formatDateLabel(date),
      times
    }));
  }

  formatDateLabel(dateStr: string): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return `${this.DAY_LABELS[d.getDay()]} ${day} ${this.MONTH_NAMES[month - 1]}`;
  }

  selectDateAndTime(date: string, time: string): void {
    this.selectedDate.set(date);
    this.selectedTime.set(time);
  }

  isTimeSelected(date: string, time: string): boolean {
    return this.selectedDate() === date && this.selectedTime() === time;
  }

  // ─── Step 3: Toggle service ────────────────────────────────────────────────

  toggleService(serviceId: number): void {
    this.services.update(list =>
      list.map(s => s.id === serviceId ? { ...s, selected: !s.selected } : s)
    );
  }

  // ─── Build summary ─────────────────────────────────────────────────────────

  get summaryDateTime(): string {
    if (!this.selectedDate() || !this.selectedTime()) return '—';
    return `${this.formatDateLabel(this.selectedDate())} às ${this.selectedTime()}`;
  }

  get summaryFinishTime(): string {
    const [h, m] = this.selectedTime().split(':').map(Number);
    const finish = new Date(0, 0, 0, h + 1, m);
    return `${String(finish.getHours()).padStart(2, '0')}:${String(finish.getMinutes()).padStart(2, '0')}`;
  }

  get summaryServices(): string {
    return this.selectedServices().map(s => s.name).join(', ') || '—';
  }

  private buildDateTime(date: string, time: string): string {
    return `${date} ${time}:00`;
  }

  // ─── Submit ────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (!this.canAdvanceStep3()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // Decode customerId from JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    const customerId: number = payload.userId ?? 0;

    const payload2: ScheduleRequest = {
      services: this.selectedServices().map(s => s.id),
      customer: customerId,
      barber: parseInt(this.barberId(), 10),
      startTime: this.buildDateTime(this.selectedDate(), this.selectedTime()),
      finishTime: this.buildDateTime(this.selectedDate(), this.summaryFinishTime)
    };

    this.customerService.createSchedule(payload2).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Agendamento confirmado com sucesso!');
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 400) {
          this.errorMessage.set('Conflito de horário. Escolha outro horário.');
        } else if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage.set('Erro ao realizar agendamento. Tente novamente.');
        }
      }
    });
  }

  resetForm(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
    this.selectedDate.set('');
    this.selectedTime.set('');
    this.services.update(list => list.map(s => ({ ...s, selected: false })));
    this.currentStep.set(1);
  }
}