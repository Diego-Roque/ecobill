interface MiHogarCardProps {
    cuentaSacmex?: string;
    tipoToma?: string;
    miembros?: number;
    tarifa?: string;
    facturaProyectada?: number;
}

export default function MiHogarCard({
                                        cuentaSacmex = "****-4521",
                                        tipoToma = "Doméstica",
                                        miembros = 4,
                                        tarifa = "T1 — Popular",
                                        facturaProyectada = 242,
                                    }: MiHogarCardProps) {
    const rows = [
        { label: "Cuenta SACMEX",      value: cuentaSacmex,                      style: "text-slate-800 font-normal" },
        { label: "Tipo de toma",        value: tipoToma,                           style: "text-slate-800 font-bold"   },
        { label: "Miembros del hogar",  value: `${miembros} personas`,             style: "text-slate-800 font-bold"   },
        { label: "Tarifa actual",       value: tarifa,                             style: "text-teal-500 font-bold"    },
        { label: "Factura proyectada",  value: `$${facturaProyectada} MXN`,        style: "text-slate-800 font-bold"   },
    ];

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm w-full">
            <h2 className="text-base font-bold text-slate-900 mb-4">Mi hogar</h2>

            <div className="flex flex-col divide-y divide-slate-100">
                {rows.map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-3">
                        <span className="text-sm text-slate-400">{row.label}</span>
                        <span className={`text-sm ${row.style}`}>{row.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}