'use client';

import { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface TarifaRow {
    id: string;
    label: string;
    detail: string;
    amount: number;
    isCurrent?: boolean;
    expandedText?: string;
    expandedRange?: string;
}

interface OtroCargo {
    label: string;
    amount: number;
}

interface DesgloseTarifarioProps {
    tipoToma?: string;
    tarifa?: string;
    tarifas?: TarifaRow[];
    otrosCargos?: OtroCargo[];
}

export default function MiHogarCard({
                                              tipoToma = "Domestica T2",
                                              tarifa = "T2",
                                              tarifas = [
                                                  { id: 't1', label: 'T1 - Base',        detail: '6.0 m³ x $4.80/m3',  amount: 28.80 },
                                                  { id: 't2', label: 'T2 - Excedente 1', detail: '9.0 m³ x $12.50/m3', amount: 112.50, isCurrent: true,
                                                      expandedText: 'Consumo intermedio domestico. Tu hogar esta aqui.', expandedRange: 'Rango: 6 - 15 m³' },
                                                  { id: 't3', label: 'T3 - Excedente 2', detail: '8.4 m³ x $28.40/m3', amount: 238.56 },
                                              ],
                                              otrosCargos = [
                                                  { label: 'Drenaje',           amount: 380 },
                                                  { label: 'Saneamiento',       amount: 520 },
                                                  { label: 'Servicio medidor',  amount: 200 },
                                              ],
                                          }: DesgloseTarifarioProps) {
    const [expanded, setExpanded] = useState<string | null>('t2');

    const subtotalOtros = otrosCargos.reduce((s, c) => s + c.amount, 0);
    const total = tarifas.reduce((s, t) => s + t.amount, 0) + subtotalOtros;

    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm w-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-bold text-slate-900">Desglose tarifario progresivo</h2>
                    <Info size={15} className="text-slate-400" />
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 font-medium px-3 py-1 rounded-full whitespace-nowrap">
                    {tipoToma}
                </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
                Consumo marginal: cada m3 extra en T3 cuesta 2.3x mas que T2
            </p>

            {/* Tarifa rows */}
            <div className="flex flex-col gap-2 mb-3">
                {tarifas.map((t) => {
                    const isOpen = expanded === t.id;
                    return (
                        <div
                            key={t.id}
                            className={`rounded-2xl p-4 cursor-pointer transition-all
                                ${t.isCurrent ? 'bg-teal-50 border border-teal-200' : 'bg-slate-50'}`}
                            onClick={() => setExpanded(isOpen ? null : t.id)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-800">{t.label}</span>
                                        {t.isCurrent && (
                                            <span className="text-[10px] font-semibold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                                                Tu tarifa
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">{t.detail}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-bold text-slate-800 font-mono">
                                        ${t.amount.toFixed(2)}
                                    </span>
                                    {isOpen
                                        ? <ChevronUp size={15} className="text-slate-400" />
                                        : <ChevronDown size={15} className="text-slate-400" />
                                    }
                                </div>
                            </div>
                            {isOpen && t.expandedText && (
                                <div className="mt-3 pt-3 border-t border-teal-100">
                                    <p className="text-xs text-slate-600">{t.expandedText}</p>
                                    {t.expandedRange && (
                                        <p className="text-xs text-slate-400 mt-0.5">{t.expandedRange}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Otros cargos */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                <p className="text-sm font-bold text-slate-800 mb-3">Otros cargos</p>
                <div className="flex flex-col gap-2">
                    {otrosCargos.map((c) => (
                        <div key={c.label} className="flex justify-between">
                            <span className="text-sm text-slate-500">{c.label}</span>
                            <span className="text-sm text-slate-500 font-mono">${c.amount.toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-slate-200 mt-1">
                        <span className="text-sm text-slate-500">Subtotal otros</span>
                        <span className="text-sm font-bold text-slate-800 font-mono">${subtotalOtros.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-base font-bold text-slate-900">Total proyectado</span>
                <span className="text-xl font-black text-teal-500 font-mono">${total.toLocaleString('en-MX', { minimumFractionDigits: 2 })}</span>
            </div>
        </div>
    );
}