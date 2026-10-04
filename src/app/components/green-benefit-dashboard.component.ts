import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, GreenTransaction } from '../../types/commute';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-green-benefit-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="space-y-8 max-w-6xl mx-auto">
      <!-- Top Banner explaining the Corporate Benefit -->
      <div class="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        <div class="relative z-10 max-w-3xl">
          <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 mb-2 tracking-wide uppercase">
            <app-icon name="sparkles" className="w-3.5 h-3.5"></app-icon>
            Corporate Sustainability Benefit Program
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-balance">
            Earn ₹3 on Every Bike Pool & ₹5 on Every Car Pool
          </h1>
          <p class="text-sm text-slate-200 leading-relaxed max-w-2xl">
            Partnered IT companies in Hyderabad ({{ currentUser.company }}, Google, Amazon HYD11, TCS, Infosys, Wipro, and more) sponsor real monetary green commute subsidies directly to commuters and ride hosts. Every completed ride reduces Cyberabad and Financial District traffic congestion.
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-6 text-xs text-emerald-100">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-emerald-800/80 border border-emerald-600 flex items-center justify-center font-bold text-white">
                ₹3
              </span>
              <div>
                <div class="font-semibold text-white">Bike Pooling Subsidy</div>
                <div class="text-emerald-300/80">Paid per completed pillion ride</div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-emerald-800/80 border border-emerald-600 flex items-center justify-center font-bold text-white">
                ₹5
              </span>
              <div>
                <div class="font-semibold text-white">Car Pooling Subsidy</div>
                <div class="text-emerald-300/80">Paid per completed carpool ride</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="successNotice" class="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl flex items-center gap-2 text-sm animate-in fade-in">
        <app-icon name="check-circle-2" className="w-5 h-5 text-emerald-600 shrink-0"></app-icon>
        <span>{{ successNotice }}</span>
      </div>

      <!-- Grid: Wallet Overview & Campus Impact -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Personal Green Wallet -->
        <div class="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <app-icon name="wallet" className="w-4 h-4"></app-icon>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-slate-900">Your Green Commute Wallet</h3>
                  <div class="text-xs text-slate-500">{{ currentUser.name }} · {{ currentUser.company }}</div>
                </div>
              </div>

              <div class="text-right">
                <div class="text-xs text-slate-400">Available Balance</div>
                <div class="text-2xl font-black text-emerald-700 font-mono tabular-nums">
                  ₹{{ currentUser.greenWalletBalance.toFixed(2) }}
                </div>
              </div>
            </div>

            <!-- Quick Metrics -->
            <div class="grid grid-cols-3 gap-3 mb-6 text-center">
              <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div class="text-[11px] text-slate-500">Completed Pools</div>
                <div class="text-base font-bold text-slate-900 font-mono tabular-nums">
                  {{ currentUser.ridesCompleted }}
                </div>
              </div>
              <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div class="text-[11px] text-slate-500">CO2 Offset</div>
                <div class="text-base font-bold text-emerald-700 font-mono tabular-nums">
                  {{ currentUser.co2SavedKg }} kg
                </div>
              </div>
              <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div class="text-[11px] text-slate-500">Benefit Rate</div>
                <div class="text-base font-bold text-slate-900 font-mono tabular-nums">
                  ₹3 / ₹5
                </div>
              </div>
            </div>

            <!-- Redeem Funds Form -->
            <form (ngSubmit)="handleRedeem()" class="bg-slate-50/70 border border-slate-200 rounded-xl p-4 space-y-4">
              <div class="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <app-icon name="gift" className="w-3.5 h-3.5 text-emerald-600"></app-icon>
                Redeem Accumulated Green Subsidies
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] text-slate-500 mb-1">Redemption Channel</label>
                  <select
                    [(ngModel)]="redeemMethod"
                    name="redeemMethod"
                    class="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="cafeteria">Campus Food & Cafeteria Card</option>
                    <option value="fuel">HPCL / IndianOil Fuel Card</option>
                    <option value="payroll">Salary Payroll Travel Allowance</option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] text-slate-500 mb-1">
                    Amount: <span class="font-mono font-bold text-slate-900">₹{{ redeemAmount }}</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    [max]="maxRedeemAmount"
                    step="5"
                    [(ngModel)]="redeemAmount"
                    name="redeemAmount"
                    [disabled]="currentUser.greenWalletBalance < 10"
                    class="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                [disabled]="currentUser.greenWalletBalance < 10"
                [class]="'w-full py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ' +
                  (currentUser.greenWalletBalance < 10
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs')"
              >
                {{ currentUser.greenWalletBalance < 10
                  ? 'Min. ₹10 required to redeem'
                  : 'Redeem ₹' + redeemAmount + ' to ' + (redeemMethod === 'cafeteria' ? 'Food Card' : redeemMethod === 'fuel' ? 'Fuel Voucher' : 'Payroll') }}
              </button>
            </form>
          </div>
        </div>

        <!-- Corporate Campus Aggregated Stats -->
        <div class="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 pb-4 border-b border-slate-100 mb-5">
              <app-icon name="building-2" className="w-4 h-4 text-slate-700"></app-icon>
              <div>
                <h3 class="text-sm font-bold text-slate-900">Hyderabad IT Campus Sustainability Hub</h3>
                <div class="text-xs text-slate-500">HITEC City, Financial District & Knowledge City</div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div class="text-xs text-slate-500">Corporate Subsidies Disbursed</div>
                  <div class="text-lg font-bold text-slate-900 font-mono tabular-nums">₹58,410.00</div>
                </div>
                <div class="text-xs text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">
                  +14% this month
                </div>
              </div>

              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div class="text-xs text-slate-500">Total Campus Pools Completed</div>
                  <div class="text-lg font-bold text-slate-900 font-mono tabular-nums">14,820 rides</div>
                </div>
                <div class="text-xs text-slate-600 font-mono">
                  11,240 Bike · 3,580 Car
                </div>
              </div>

              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div class="text-xs text-slate-500">CO2 Emissions Prevented</div>
                  <div class="text-lg font-bold text-emerald-700 font-mono tabular-nums">23.4 Metric Tons</div>
                </div>
                <div class="text-xs text-slate-500">
                  ESG Audit Ready
                </div>
              </div>

              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div class="text-xs text-slate-500">Campus Parking Bays Saved</div>
                  <div class="text-lg font-bold text-slate-900 font-mono tabular-nums">4,280 bays/day</div>
                </div>
                <div class="text-xs text-slate-500">
                  Peak Traffic Relief
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Participating Hyderabad Campuses: Microsoft IDC Gachibowli, Google Financial District, Amazon HYD11, TCS Synergy Park, Infosys Gachibowli & Pocharam, Wipro Circle.
          </div>
        </div>
      </div>

      <!-- Transaction Ledger -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 class="text-sm font-bold text-slate-900">Green Subsidy & Cost Split Ledger</h3>
            <div class="text-xs text-slate-500">Transparent audit trail of your commute benefits and fuel shares</div>
          </div>
          <span class="text-xs text-slate-500 font-mono">{{ transactions.length }} records</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="text-slate-400 border-b border-slate-100 pb-2">
                <th class="font-semibold py-2">Date & Time</th>
                <th class="font-semibold py-2">Transaction Description</th>
                <th class="font-semibold py-2">Benefit Type</th>
                <th class="font-semibold py-2 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let tx of transactions" class="hover:bg-slate-50/60 transition-colors">
                <td class="py-2.5 font-mono text-slate-600 whitespace-nowrap">{{ tx.date }}</td>
                <td class="py-2.5 font-medium text-slate-800">{{ tx.description }}</td>
                <td class="py-2.5">
                  <span *ngIf="tx.type === 'bike_subsidy'" class="text-emerald-700 font-medium flex items-center gap-1">
                    <app-icon name="bike" className="w-3.5 h-3.5"></app-icon> Bike Benefit (₹3)
                  </span>
                  <span *ngIf="tx.type === 'car_subsidy'" class="text-blue-700 font-medium flex items-center gap-1">
                    <app-icon name="car" className="w-3.5 h-3.5"></app-icon> Car Benefit (₹5)
                  </span>
                  <span *ngIf="tx.type === 'fuel_split_paid'" class="text-slate-600">
                    Fuel Cost Share
                  </span>
                  <span *ngIf="tx.type === 'wallet_redemption'" class="text-amber-700 font-medium">
                    Voucher Redemption
                  </span>
                </td>
                <td class="py-2.5 text-right font-mono tabular-nums font-semibold whitespace-nowrap">
                  <span *ngIf="tx.status === 'credited'" class="text-emerald-700">+₹{{ tx.amount.toFixed(2) }}</span>
                  <span *ngIf="tx.status !== 'credited'" class="text-slate-700">-₹{{ tx.amount.toFixed(2) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class GreenBenefitDashboardComponent {
  @Input() currentUser!: Employee;
  @Input() transactions: GreenTransaction[] = [];
  @Output() redeemFunds = new EventEmitter<{ amount: number; method: string }>();

  redeemMethod: 'cafeteria' | 'fuel' | 'payroll' = 'cafeteria';
  redeemAmount: number = 50;
  successNotice: string | null = null;

  get maxRedeemAmount(): number {
    return Math.max(10, Math.floor(this.currentUser?.greenWalletBalance || 10));
  }

  handleRedeem() {
    if (this.currentUser.greenWalletBalance < this.redeemAmount) {
      this.successNotice = 'Insufficient Green Wallet balance to redeem this amount.';
      setTimeout(() => (this.successNotice = null), 4000);
      return;
    }

    const labels = {
      cafeteria: 'Campus Cafeteria Food Card',
      fuel: 'HPCL / IndianOil Fuel Voucher',
      payroll: 'Monthly Payroll Tax-Free Commute Reimbursement',
    };

    this.redeemFunds.emit({
      amount: this.redeemAmount,
      method: labels[this.redeemMethod],
    });

    this.successNotice = `Successfully redeemed ₹${this.redeemAmount} to ${labels[this.redeemMethod]}!`;
    setTimeout(() => (this.successNotice = null), 4000);
  }
}
