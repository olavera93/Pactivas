<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
        font-family: DejaVu Sans, sans-serif;
        font-size: 10px;
        color: #1e293b;
        background: white;
    }

    /* ── Header ── */
    .header {
        background: #ffffff;
        padding: 16px 30px;
        display: table;
        width: 100%;
        border-bottom: 2px solid #e2e8f0;
    }
    .header-left  { display: table-cell; vertical-align: middle; }
    .header-right { display: table-cell; vertical-align: middle; text-align: right; white-space: nowrap; padding-left: 20px; }

    .header-org   { font-size: 7px; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
    .header-title { font-size: 16px; font-weight: bold; color: #0f172a; line-height: 1.2; }

    .header-label { font-size: 6.5px; letter-spacing: 1.5px; text-transform: uppercase; color: #94a3b8; }
    .header-value { font-size: 11px; font-weight: bold; color: #0f172a; margin-top: 2px; }

    .header-meta { display: table; border-collapse: separate; border-spacing: 0; }
    .header-meta-cell {
        display: table-cell;
        vertical-align: middle;
        text-align: right;
        padding-left: 18px;
        border-left: 1px solid #e2e8f0;
    }
    .header-meta-cell:first-child { border-left: none; padding-left: 0; }

    /* ── KPI Strip ── */
    .kpi-strip {
        border-bottom: 1px solid #e2e8f0;
    }
    .kpi-strip table {
        width: 100%;
        border-collapse: collapse;
    }
    .kpi-item {
        width: 25%;
        padding: 12px 30px;
        vertical-align: middle;
        border-right: 1px solid #e2e8f0;
    }
    .kpi-item:last-child { border-right: none; }
    .kpi-inner { display: table; width: 100%; }
    .kpi-text  { display: table-cell; vertical-align: middle; }
    .kpi-accent { display: table-cell; vertical-align: middle; text-align: right; }
    .kpi-dot {
        display: inline-block;
        width: 8px; height: 8px;
        border-radius: 50%;
        vertical-align: middle;
    }

    .kpi-num   { font-size: 22px; font-weight: bold; line-height: 1; }
    .kpi-label { font-size: 7px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-top: 3px; }

    /* ── Period bar ── */
    .period-bar {
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        padding: 7px 30px;
        display: table;
        width: 100%;
    }
    .period-left  { display: table-cell; vertical-align: middle; }
    .period-right { display: table-cell; vertical-align: middle; text-align: right; }
    .period-tag {
        display: inline-block;
        font-size: 6.5px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: #64748b;
        margin-right: 6px;
    }
    .period-val {
        display: inline-block;
        font-size: 8px;
        font-weight: bold;
        color: #334155;
    }
    .period-sep {
        display: inline-block;
        color: #cbd5e1;
        margin: 0 10px;
        font-size: 8px;
    }

    /* ── Content ── */
    .content { padding: 14px 30px; }

    .sec-label {
        font-size: 6.5px;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #94a3b8;
        margin-bottom: 8px;
        padding-bottom: 6px;
        border-bottom: 1px solid #f1f5f9;
    }

    /* ── Table ── */
    table.main { width: 100%; border-collapse: collapse; font-size: 8.5px; }
    table.main thead tr { background: #f8fafc; border-bottom: 2px solid #e2e8f0; }
    table.main thead th {
        padding: 7px 10px;
        color: #64748b;
        text-align: left;
        font-size: 6.5px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: bold;
    }
    table.main tbody tr:nth-child(even) { background: #f8fafc; }
    table.main tbody tr:nth-child(odd)  { background: #ffffff; }
    table.main tbody td {
        padding: 6px 10px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
        color: #334155;
    }
    table.main tbody tr:last-child td { border-bottom: none; }

    /* ── Badges ── */
    .badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 3px;
        font-size: 7px;
        font-weight: bold;
        letter-spacing: 0.3px;
    }

    .cat-chip {
        display: inline-block;
        background: #f0f9ff;
        color: #0369a1;
        border: 1px solid #bae6fd;
        border-radius: 3px;
        font-size: 7px;
        font-weight: bold;
        padding: 2px 5px;
    }

    /* ── Signatures ── */
    .firma-section {
        padding: 20px 30px 16px;
        border-top: 2px solid #e2e8f0;
        margin-top: 30px;
    }
    .firma-table { width: 100%; border-collapse: separate; border-spacing: 20px 0; }
    .firma-cell  { width: 50%; text-align: center; padding: 0 10px; }
    .firma-space {
        display: block;
        height: 42px;
    }
    .firma-line  {
        display: block;
        border-top: 1.5px solid #475569;
        width: 80%;
        margin: 0 auto 10px;
    }
    .firma-name { font-size: 9px; font-weight: bold; color: #0f172a; }
    .firma-role { font-size: 7px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-top: 3px; }

    /* ── Footer ── */
    .footer {
        border-top: 1px solid #f1f5f9;
        padding: 5px 30px;
        margin-top: 14px;
        display: table;
        width: 100%;
    }
    .footer-left  { display: table-cell; font-size: 6.5px; color: #cbd5e1; letter-spacing: 0.5px; vertical-align: middle; }
    .footer-right { display: table-cell; font-size: 6.5px; color: #cbd5e1; text-align: right; vertical-align: middle; }
</style>
</head>
<body>

@php
    $total         = $registros->count();
    $pendientes    = $registros->where('estado', 'pendiente')->count();
    $confirmados   = $registros->where('estado', 'confirmado')->count();
    $noConfirmados = $registros->where('estado', 'no_confirmado')->count();

    $periodoDesde = !empty($filtros['fecha_inicio'])
        ? \Carbon\Carbon::parse($filtros['fecha_inicio'])->format('d/m/Y')
        : null;
    $periodoHasta = !empty($filtros['fecha_fin'])
        ? \Carbon\Carbon::parse($filtros['fecha_fin'])->format('d/m/Y')
        : null;
@endphp

<!-- Header -->
<div class="header">
    <div class="header-left">
        <div class="header-org">La Farmacia Homeopática &mdash; Sistema de Gestión de Calidad</div>
        <div class="header-title">Reporte de Oportunidades de Mejora</div>
    </div>
    <div class="header-right">
        <div class="header-meta">
            <div class="header-meta-cell">
                <div class="header-label">Generado</div>
                <div class="header-value">{{ \Carbon\Carbon::now()->format('d/m/Y') }}</div>
            </div>
            @if($periodoDesde || $periodoHasta)
            <div class="header-meta-cell">
                <div class="header-label">Per&iacute;odo</div>
                <div class="header-value">{{ $periodoDesde ?? '&mdash;' }} &mdash; {{ $periodoHasta ?? '&mdash;' }}</div>
            </div>
            @endif
        </div>
    </div>
</div>

<!-- KPI Strip -->
<div class="kpi-strip">
    <table>
        <tr>
            <td class="kpi-item" style="border-top: 3px solid #0ea5e9;">
                <div class="kpi-inner">
                    <div class="kpi-text">
                        <div class="kpi-num" style="color:#0ea5e9;">{{ $total }}</div>
                        <div class="kpi-label">Total registros</div>
                    </div>
                </div>
            </td>
            <td class="kpi-item" style="border-top: 3px solid #f59e0b;">
                <div class="kpi-inner">
                    <div class="kpi-text">
                        <div class="kpi-num" style="color:#d97706;">{{ $pendientes }}</div>
                        <div class="kpi-label">Pendientes</div>
                    </div>
                </div>
            </td>
            <td class="kpi-item" style="border-top: 3px solid #22c55e;">
                <div class="kpi-inner">
                    <div class="kpi-text">
                        <div class="kpi-num" style="color:#16a34a;">{{ $confirmados }}</div>
                        <div class="kpi-label">Confirmados</div>
                    </div>
                </div>
            </td>
            <td class="kpi-item" style="border-top: 3px solid #ef4444;">
                <div class="kpi-inner">
                    <div class="kpi-text">
                        <div class="kpi-num" style="color:#dc2626;">{{ $noConfirmados }}</div>
                        <div class="kpi-label">No confirmados</div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</div>

<!-- Period / filters bar -->
<div class="period-bar">
    <div class="period-left">
        @if($filtros['area'])
            <span class="period-tag">Área</span>
            <span class="period-val">{{ $filtros['area'] }}</span>
            <span class="period-sep">|</span>
        @endif
        @if($filtros['estado'])
            <span class="period-tag">Estado</span>
            <span class="period-val">{{ ucfirst(str_replace('_', ' ', $filtros['estado'])) }}</span>
            <span class="period-sep">|</span>
        @endif
        @if(!$filtros['area'] && !$filtros['estado'])
            <span class="period-tag">Filtros</span>
            <span class="period-val">Sin filtros aplicados &mdash; todos los registros</span>
        @endif
    </div>
    <div class="period-right">
        <span class="period-tag">Registros en este reporte</span>
        <span class="period-val">{{ $total }}</span>
    </div>
</div>

<!-- Table -->
<div class="content">
    <div class="sec-label">Detalle de oportunidades</div>

    <table class="main">
        <thead>
            <tr>
                <th style="width:22px;">#</th>
                <th style="width:90px; white-space:nowrap;">N&ordm; Orden</th>
                <th style="width:140px;">Responsable</th>
                <th style="width:78px;">&Aacute;rea</th>
                <th style="width:110px;">Descripci&oacute;n</th>
                <th style="width:28px; text-align:center;">Est.</th>
                <th style="width:66px;">Fecha Caso</th>
            </tr>
        </thead>
        <tbody>
            @forelse($registros as $r)
            <tr>
                <td style="color:#cbd5e1; font-size:8px;">{{ $r->id }}</td>
                <td style="font-family: monospace; color:#475569; font-size:8px; white-space:nowrap;">{{ $r->no_orden ?? '&mdash;' }}</td>
                <td style="color:#475569;">{{ $r->nombre_responsable ?? '&mdash;' }}</td>
                <td style="color:#475569;">{{ $r->area_responsable ?? $r->area }}</td>
                <td style="color:#64748b; font-size:8.5px; word-wrap:break-word; white-space:normal;">{{ $r->descripcion }}</td>
                <td style="text-align:center; font-size:8px; font-weight:bold; color:#475569;">
                    @php
                        $inicial = ['pendiente' => 'P', 'confirmado' => 'C', 'no_confirmado' => 'N'][$r->estado] ?? '?';
                    @endphp
                    {{ $inicial }}
                </td>
                <td style="color:#94a3b8; white-space:nowrap; font-size:8px;">
                    {{ $r->fecha_caso ? \Carbon\Carbon::parse($r->fecha_caso)->format('d/m/Y') : '&mdash;' }}
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align:center; color:#94a3b8; padding:28px; font-style:italic;">
                    Sin registros para los filtros aplicados.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

<!-- Signatures -->
<div class="firma-section">
    <table class="firma-table">
        <tr>
            <td class="firma-cell">
                <span class="firma-space"></span>
                <span class="firma-line"></span>
                <div class="firma-name">Quien Socializa</div>
            </td>
            <td class="firma-cell">
                <span class="firma-space"></span>
                <span class="firma-line"></span>
                <div class="firma-name">Colaborador que Recibe</div>
            </td>
        </tr>
    </table>
</div>

<!-- Footer -->
<div class="footer">
    <span class="footer-left">SISTEMA DE CALIDAD V2.0 &mdash; LA FARMACIA HOMEOPÁTICA</span>
    <span class="footer-right">{{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}</span>
</div>

</body>
</html>
