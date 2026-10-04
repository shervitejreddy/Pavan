import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../types/commute';
import { DEMO_EMPLOYEES } from '../../data/mockData';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-user-profile-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 class="text-base font-bold text-slate-900">
              Active IT Employee Profile
            </h2>
            <div class="text-xs text-slate-500">
              Switch corporate identities or inspect verified campus status
            </div>
          </div>
          <button
            type="button"
            (click)="close.emit()"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <app-icon name="x" className="w-5 h-5"></app-icon>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Active Card -->
          <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-xs">
                {{ currentUser.name.charAt(0) }}
              </div>
              <div>
                <div class="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{{ currentUser.name }}</span>
                  <app-icon name="shield-check" className="w-4 h-4 text-emerald-600"></app-icon>
                </div>
                <div class="text-xs text-slate-600">{{ currentUser.role }}</div>
                <div class="text-xs text-emerald-800 font-medium">{{ currentUser.company }} ({{ currentUser.employeeId }})</div>
              </div>
            </div>

            <div class="text-right text-xs">
              <div class="text-slate-500">Green Balance</div>
              <div class="text-base font-extrabold text-emerald-700 font-mono tabular-nums">
                ₹{{ currentUser.greenWalletBalance.toFixed(2) }}
              </div>
            </div>
          </div>

          <!-- Switch Demo Personas -->
          <div>
            <div class="text-xs font-semibold text-slate-700 mb-2">
              Switch IT Colleague Account (Demo Mode):
            </div>
            <div class="space-y-2">
              <button
                *ngFor="let emp of demoEmployees"
                type="button"
                (click)="onChoose(emp)"
                [class]="'w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ' +
                  (emp.id === currentUser.id
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50')"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs border border-slate-200">
                    {{ emp.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-slate-900 flex items-center gap-1">
                      <span>{{ emp.name }}</span>
                      <span class="text-[10px] text-slate-500 font-normal">({{ emp.company }})</span>
                    </div>
                    <div class="text-[11px] text-slate-500">
                      {{ emp.email }} · {{ emp.ridesCompleted }} rides completed
                    </div>
                  </div>
                </div>

                <span *ngIf="emp.id === currentUser.id" class="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <app-icon name="check" className="w-4 h-4"></app-icon> Active
                </span>
                <span *ngIf="emp.id !== currentUser.id" class="text-xs text-slate-400 font-medium">
                  Switch
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            (click)="close.emit()"
            class="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `
})
export class UserProfileModalComponent {
  @Input() currentUser!: Employee;
  @Output() close = new EventEmitter<void>();
  @Output() selectUser = new EventEmitter<Employee>();

  demoEmployees = DEMO_EMPLOYEES;

  onChoose(emp: Employee) {
    this.selectUser.emit(emp);
    this.close.emit();
  }
}
