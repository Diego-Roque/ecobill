'use client';

import { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { MIHOGAR_DATA } from "@/data/Consumptiondata";

export default function MiHogarCard() {
    const { tipoToma, tarifas, otrosCargos } = MIHOGAR_DATA;

    const defaultOpen = tarifas.find(t => t.isCurrent)?.id ?? tarifas[0]?.id ?? null;
    const [expanded, setExpanded] = useState<string | null>(defaultOpen);

    const subtotalOtros = otrosCargos.reduce((s, c) => s + c.amount, 0);
    const subtotalTarifas = tarifas.reduce((s, t) => s + t.amount, 0);
    const total = subtotalTarifas + subtotalOtros;

    // Barra de proporción visual entre tramos
    const maxAmount = Math.max(...tarifas.map(t => t.amount));

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
                Cada tramo tiene su propio precio — pagas más por m³ conforme consumes más.
            </p>

            {/* Tarifa rows */}
            <div className="flex flex-col gap-2 mb-3">
                {tarifas.map((t) => {
                    const isOpen = expanded === t.id;
                    const barWidth = Math.round((t.amount / maxAmount) * 100);

                    return (
                        <div
                            key={t.id}
                            className={`rounded-2xl p-4 cursor-pointer transition-all
                                ${t.isCurrent
                                ? 'bg-teal-50 border border-teal-200'
                                : 'bg-slate-50 border border-transparent'}`}
                            onClick={() => setExpanded(isOpen ? null : t.id)}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex-1 min-w-0 mr-4">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-sm font-bold text-slate-800">{t.label}</span>
                                        {t.isCurrent && (
                                            <span className="text-[10px] font-semibold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                                                Tu tarifa actual
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400">{t.detail}</p>
                                    {/* Barra proporcional al costo del tramo */}
                                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${t.isCurrent ? 'bg-teal-400' : 'bg-slate-300'}`}
                                            style={{ width: `${barWidth}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <span className={`text-sm font-bold font-mono ${t.isCurrent ? 'text-teal-700' : 'text-slate-800'}`}>
                                        ${t.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </span>
                                    {isOpen
                                        ? <ChevronUp   size={15} className="text-slate-400" />
                                        : <ChevronDown size={15} className="text-slate-400" />
                                    }
                                </div>
                            </div>

                            {isOpen && (
                                <div className="mt-3 pt-3 border-t border-slate-200 space-y-1">
                                    {t.expandedText && (
                                        <p className="text-xs text-slate-600">{t.expandedText}</p>
                                    )}
                                    {t.expandedRange && (
                                        <p className="text-xs text-slate-400">{t.expandedRange}</p>
                                    )}
                                    <p className="text-xs text-slate-400">
                                        Este tramo representa{' '}
                                        <span className="font-semibold text-slate-600">
                                            {Math.round((t.amount / subtotalTarifas) * 100)}%
                                        </span>{' '}
                                        del costo por consumo
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Subtotal tarifas */}
            <div className="flex justify-between items-center px-1 mb-3">
                <span className="text-xs text-slate-400">Subtotal consumo</span>
                <span className="text-xs font-bold text-slate-600 font-mono">
                    ${subtotalTarifas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
            </div>

            {/* Otros cargos */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                <p className="text-sm font-bold text-slate-800 mb-3">Otros cargos fijos</p>
                <div className="flex flex-col gap-2">
                    {otrosCargos.map((c) => (
                        <div key={c.label} className="flex justify-between">
                            <span className="text-sm text-slate-500">{c.label}</span>
                            <span className="text-sm text-slate-500 font-mono">
                                ${c.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-slate-200 mt-1">
                        <span className="text-sm text-slate-500">Subtotal otros</span>
                        <span className="text-sm font-bold text-slate-800 font-mono">
                            ${subtotalOtros.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-base font-bold text-slate-900">Total proyectado</span>
                <span className="text-xl font-black text-teal-500 font-mono">
                    ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
            </div>
        </div>
    );
}