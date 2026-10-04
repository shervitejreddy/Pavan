import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, VerificationRequest } from '../../types/commute';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-company-verification-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-8 max-w-5xl mx-auto">
      <!-- Top Banner -->
      <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <app-icon name="shield-check" className="w-5 h-5 text-emerald-600"></app-icon>
              <h1 class="text-xl font-bold tracking-tight text-slate-900">
                Corporate Employee Verification Management
              </h1>
            </div>
            <p class="text-xs text-slate-500 max-w-2xl">
              All Gopool users are verified through their corporate HR credentials and work email domains. Company verification unlocks the ₹3/ride (Bike) and ₹5/ride (Car) employer green commute subsidies.
            </p>
          </div>

          <div class="flex items-center gap-2 self-start sm:self-center">
            <span class="text-xs text-slate-500 font-medium">Portal View:</span>
            <div class="flex bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                (click)="adminMode = false"
                [class]="'px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ' +
                  (!adminMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900')"
              >
                My IT Badge
              </button>
              <button
                type="button"
                (click)="adminMode = true"
                [class]="'px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ' +
                  (adminMode ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900')"
              >
                HR Admin Console
              </button>
            </div>
          </div>
        </div>

        <!-- View Mode 1: Employee's Verified Status & Badge -->
        <div *ngIf="!adminMode" class="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          <div class="md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="text-xs font-mono tracking-widest text-emerald-400 uppercase">
                  CAMPUS VERIFIED PASS
                </div>
                <app-icon name="shield-check" className="w-5 h-5 text-emerald-400"></app-icon>
              </div>

              <div class="space-y-1 mb-6">
                <div class="text-lg font-bold text-white">{{ currentUser.name }}</div>
                <div class="text-xs text-slate-300">{{ currentUser.role }}</div>
                <div class="text-xs text-emerald-300 font-medium">{{ currentUser.company }}</div>
              </div>

              <div class="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-700/60 font-mono">
                <div class="flex justify-between">
                  <span class="text-slate-400">Employee ID:</span>
                  <span class="text-white">{{ currentUser.employeeId }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Work Domain:</span>
                  <span class="text-emerald-300">&#64;{{ currentUser.companyDomain }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Campus Office:</span>
                  <span class="text-white truncate max-w-[170px]">{{ currentUser.campusOffice.split('(')[0] }}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span class="text-emerald-400 font-semibold">✓ Active Green Subsidy Benefit</span>
              <span class="font-mono">Security Tier 1</span>
            </div>
          </div>

          <!-- Verification Benefits checklist -->
          <div class="md:col-span-7 space-y-4">
            <h3 class="text-sm font-bold text-slate-900">
              Company Managed Safety & Subsidy Guarantees
            </h3>

            <div class="space-y-3 text-xs">
              <div class="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-start gap-2.5">
                <app-icon name="shield-check" className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0"></app-icon>
                <div>
                  <strong class="text-emerald-950 font-semibold">Automatic Corporate Green Payouts:</strong>
                  <p class="text-emerald-900/80 mt-0.5">
                    Your completed rides automatically trigger ₹3 (bike) or ₹5 (car) subsidies sponsored by {{ currentUser.company }}'s sustainability budget.
                  </p>
                </div>
              </div>

              <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
                <app-icon name="building-2" className="w-4 h-4 text-slate-700 mt-0.5 shrink-0"></app-icon>
                <div>
                  <strong class="text-slate-900 font-semibold">Zero Strangers Policy:</strong>
                  <p class="text-slate-600 mt-0.5">
                    Only verified employees with authentic IT tech park IDs are allowed to offer or join rides. No commercial taxi drivers or unregistered external riders.
                  </p>
                </div>
              </div>

              <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
                <app-icon name="lock" className="w-4 h-4 text-slate-700 mt-0.5 shrink-0"></app-icon>
                <div>
                  <strong class="text-slate-900 font-semibold">Campus Gate & Parking Priority:</strong>
                  <p class="text-slate-600 mt-0.5">
                    Verified carpools and bike pools get priority gate clearance and reserved green carpool parking slots near campus building entrances.
                  </p>
                </div>
              </div>
            </div>

            <!-- Submit Verification for another teammate -->
            <div class="pt-2">
              <button
                type="button"
                (click)="adminMode = true"
                class="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer underline"
              >
                Switch to HR Verification Console to review pending colleague badges →
              </button>
            </div>
          </div>
        </div>

        <!-- View Mode 2: HR Admin Management Mode -->
        <div *ngIf="adminMode" class="mt-6 space-y-6">
          <div *ngIf="submittedMessage" class="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-3 rounded-lg">
            {{ submittedMessage }}
          </div>

          <!-- Pending Requests Queue -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-bold text-slate-900">
                Pending IT Employee Verification Queue ({{ pendingCount }} pending)
              </h3>
              <span class="text-xs text-slate-500">Corporate HR Review Queue</span>
            </div>

            <div *ngIf="verificationRequests.length === 0" class="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
              All employee verification requests have been processed.
            </div>

            <div *ngIf="verificationRequests.length > 0" class="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              <div *ngFor="let req of verificationRequests" class="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-slate-900 text-xs">{{ req.employeeName }}</span>
                    <span class="text-[11px] text-slate-500">({{ req.employeeCode }})</span>
                    <span *ngIf="req.status === 'approved'" class="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                      Approved
                    </span>
                    <span *ngIf="req.status === 'rejected'" class="text-[10px] text-red-700 font-medium bg-red-50 px-1.5 py-0.5 rounded">
                      Rejected
                    </span>
                  </div>
                  <div class="text-xs text-slate-600 mt-0.5">
                    {{ req.company }} · {{ req.department }}
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5 font-mono flex items-center gap-2">
                    <span>{{ req.workEmail }}</span>
                    <span>·</span>
                    <span>Doc: {{ req.idCardProofName }}</span>
                    <span>·</span>
                    <span>Submitted: {{ req.submittedAt }}</span>
                  </div>
                </div>

                <div *ngIf="req.status === 'pending'" class="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    (click)="approveRequest.emit(req.id)"
                    class="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <app-icon name="check" className="w-3.5 h-3.5"></app-icon>
                    <span>Approve & Grant Subsidy</span>
                  </button>
                  <button
                    type="button"
                    (click)="rejectRequest.emit(req.id)"
                    class="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                  >
                    Reject
                  </button>
                </div>

                <span *ngIf="req.status !== 'pending'" class="text-xs text-slate-500 font-medium">
                  Processed
                </span>
              </div>
            </div>
          </div>

          <!-- Test Form: Submit New Employee for Verification -->
          <div class="border border-slate-200 rounded-xl p-5 bg-slate-50">
            <h4 class="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <app-icon name="upload-cloud" className="w-4 h-4 text-emerald-600"></app-icon>
              Submit Test Employee Verification Application
            </h4>

            <form (ngSubmit)="handleSubmit()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label class="block text-[11px] text-slate-500 mb-1">Employee Full Name</label>
                <input
                  type="text"
                  [(ngModel)]="nameInput"
                  name="nameInput"
                  placeholder="e.g. Swati Rao"
                  class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label class="block text-[11px] text-slate-500 mb-1">Corporate Work Email</label>
                <input
                  type="email"
                  [(ngModel)]="emailInput"
                  name="emailInput"
                  placeholder="swati.rao@infosys.com"
                  class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label class="block text-[11px] text-slate-500 mb-1">Company</label>
                <select
                  [(ngModel)]="companyInput"
                  name="companyInput"
                  class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="Infosys Ltd">Infosys Ltd</option>
                  <option value="Tata Consultancy Services">Tata Consultancy Services</option>
                  <option value="Wipro Technologies">Wipro Technologies</option>
                  <option value="Google India">Google India</option>
                  <option value="Microsoft India">Microsoft India</option>
                </select>
              </div>

              <div class="flex items-end">
                <button
                  type="submit"
                  class="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium cursor-pointer transition-colors shadow-xs"
                >
                  Submit for HR Review
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CompanyVerificationPortalComponent {
  @Input() currentUser!: Employee;
  @Input() verificationRequests: VerificationRequest[] = [];
  @Output() approveRequest = new EventEmitter<string>();
  @Output() rejectRequest = new EventEmitter<string>();
  @Output() submitNewVerification = new EventEmitter<Partial<VerificationRequest>>();

  adminMode: boolean = false;
  nameInput: string = '';
  emailInput: string = '';
  companyInput: string = 'Infosys Ltd';
  codeInput: string = '';
  deptInput: string = '';
  submittedMessage: string | null = null;

  get pendingCount(): number {
    return this.verificationRequests.filter((r) => r.status === 'pending').length;
  }

  handleSubmit() {
    if (!this.emailInput.includes('@')) {
      this.submittedMessage = 'Please enter a valid corporate email address.';
      setTimeout(() => (this.submittedMessage = null), 4000);
      return;
    }

    this.submitNewVerification.emit({
      id: `vr-${Date.now()}`,
      employeeName: this.nameInput,
      company: this.companyInput,
      workEmail: this.emailInput,
      employeeCode: this.codeInput || `EMP-${Math.floor(10000 + Math.random() * 90000)}`,
      department: this.deptInput || 'Engineering',
      idCardProofName: `${this.nameInput.toLowerCase().replace(/\s+/g, '_')}_work_id.pdf`,
      submittedAt: 'Just now',
      status: 'pending',
    });

    this.nameInput = '';
    this.emailInput = '';
    this.codeInput = '';
    this.deptInput = '';
    this.submittedMessage = 'Verification request successfully queued for HR review.';
    setTimeout(() => (this.submittedMessage = null), 4000);
  }
}
