<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
        font-family: DejaVu Sans, sans-serif;
        font-size: 11px;
        color: #1e293b;
        background: #f1f5f9;
    }

    /* ── Wrapper ── */
    .page {
        background: white;
        margin: 0;
        padding-bottom: 40px;
    }

    /* ── Top strip ── */
    .topstrip {
        background: #0f172a;
        color: #94a3b8;
        padding: 5px 30px;
        font-size: 7.5px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        display: table;
        width: 100%;
    }
    .topstrip-left  { display: table-cell; vertical-align: middle; color: #e2e8f0; font-weight: bold; letter-spacing: 2px; }
    .topstrip-right { display: table-cell; vertical-align: middle; text-align: right; }

    /* ── Header card ── */
    .header-card {
        background: white;
        padding: 20px 30px 18px;
        border-bottom: 1px solid #e2e8f0;
    }
    .header-inner  { display: table; width: 100%; }
    .header-left   { display: table-cell; vertical-align: middle; }
    .header-right  { display: table-cell; vertical-align: top; text-align: right; white-space: nowrap; padding-left: 20px; }

    .clinical-badge {
        display: inline-block;
        font-size: 7px;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #64748b;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        padding: 2px 7px;
        margin-bottom: 7px;
        background: #f8fafc;
    }

    .header-title    { font-size: 19px; font-weight: bold; color: #0f172a; line-height: 1.2; }
    .header-subtitle { font-size: 9px; color: #64748b; margin-top: 5px; }

    .info-label { font-size: 7px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; }
    .info-value { font-size: 12px; font-weight: bold; color: #0f172a; margin-top: 1px; }
    .info-total-label { font-size: 7px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-top: 10px; }
    .info-total-value { font-size: 28px; font-weight: bold; color: #0f172a; line-height: 1; }

    /* ── KPI Cards ── */
    .kpi-section { background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 14px 30px; }
    .kpi-table   { border-collapse: separate; border-spacing: 10px 0; width: 100%; }
    .kpi-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 12px 16px;
        vertical-align: top;
        width: 25%;
    }
    .kpi-card-inner { display: table; width: 100%; }
    .kpi-text-col   { display: table-cell; vertical-align: middle; }
    .kpi-icon-col   { display: table-cell; vertical-align: middle; text-align: right; }
    .kpi-icon {
        width: 36px; height: 36px;
        border-radius: 9px;
        display: inline-block;
        text-align: center;
        line-height: 36px;
        font-size: 16px;
        font-weight: bold;
    }
    .kpi-num   { font-size: 30px; font-weight: bold; line-height: 1; }
    .kpi-label { font-size: 7.5px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-top: 3px; }
    .kpi-sub   { font-size: 8px; color: #64748b; margin-top: 5px; }
    .kpi-bar   { height: 3px; border-radius: 2px; margin-top: 10px; }

    /* ── Content area ── */
    .content { padding: 16px 30px; }

    /* ── Section header ── */
    .sec-title {
        font-size: 10px;
        font-weight: bold;
        color: #0f172a;
        letter-spacing: 0.3px;
        margin-bottom: 10px;
        padding-bottom: 7px;
        border-bottom: 2px solid #f1f5f9;
    }
    .sec-title span {
        display: inline-block;
        width: 14px; height: 14px;
        border-radius: 4px;
        background: #0ea5e9;
        margin-right: 6px;
        vertical-align: middle;
    }

    /* ── Main Table ── */
    table.main { width: 100%; border-collapse: collapse; font-size: 9px; }
    table.main thead tr { background: #1e293b; }
    table.main thead th {
        padding: 8px 10px;
        color: #e2e8f0;
        text-align: left;
        font-size: 7.5px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        font-weight: bold;
    }
    table.main tbody tr:nth-child(even) { background: #f8fafc; }
    table.main tbody tr:nth-child(odd)  { background: #ffffff; }
    table.main tbody td {
        padding: 7px 10px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
        color: #334155;
    }
    table.main tbody tr:last-child td { border-bottom: none; }

    /* ── Badges ── */
    .badge {
        display: inline-block;
        padding: 3px 9px;
        border-radius: 20px;
        font-size: 7.5px;
        font-weight: bold;
        letter-spacing: 0.3px;
    }
    .badge-pendiente     { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
    .badge-confirmado    { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
    .badge-no_confirmado { background: #fef2f2; color: #b91c1c; border: 1px solid #fca5a5; }

    /* ── Category chip ── */
    .cat-chip {
        display: inline-block;
        background: #f0f9ff;
        color: #0369a1;
        border: 1px solid #bae6fd;
        border-radius: 4px;
        font-size: 7.5px;
        font-weight: bold;
        padding: 2px 6px;
    }

    /* ── Analysis row ── */
    .analysis-row { display: table; width: 100%; border-collapse: separate; border-spacing: 12px 0; margin-top: 16px; }
    .analysis-main-cell {
        display: table-cell;
        vertical-align: top;
        width: 65%;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 14px 16px;
    }
    .analysis-quality-cell {
        display: table-cell;
        vertical-align: top;
        width: 35%;
        background: #0ea5e9;
        border-radius: 10px;
        padding: 14px 16px;
        color: white;
    }
    .analysis-badge {
        display: inline-block;
        font-size: 7px;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        background: #e2e8f0;
        color: #475569;
        border-radius: 3px;
        padding: 2px 6px;
        margin-bottom: 8px;
        font-weight: bold;
    }
    .analysis-area-tag {
        display: inline-block;
        font-size: 7px;
        letter-spacing: 1px;
        text-transform: uppercase;
        background: #dbeafe;
        color: #1d4ed8;
        border-radius: 3px;
        padding: 2px 6px;
        margin-bottom: 8px;
        font-weight: bold;
        margin-left: 4px;
    }
    .analysis-quote {
        font-size: 9.5px;
        color: #334155;
        line-height: 1.65;
        border-left: 3px solid #0ea5e9;
        padding-left: 10px;
        font-style: italic;
    }
    .analysis-meta {
        font-size: 8px;
        color: #94a3b8;
        margin-top: 8px;
    }
    .quality-icon  { font-size: 22px; margin-bottom: 6px; }
    .quality-title { font-size: 11px; font-weight: bold; margin-bottom: 6px; line-height: 1.3; }
    .quality-text  { font-size: 8.5px; opacity: 0.9; line-height: 1.55; }
    .quality-divider { border-top: 1px solid rgba(255,255,255,0.3); margin: 10px 0; }
    .quality-note { font-size: 7.5px; opacity: 0.75; font-style: italic; }

    /* ── Signatures ── */
    .firma-section {
        position: fixed;
        bottom: 28px; left: 0; right: 0;
        padding: 10px 30px 0;
        border-top: 1px solid #e2e8f0;
        background: white;
    }
    .firma-table { width: 100%; border-collapse: separate; border-spacing: 20px 0; }
    .firma-cell  { width: 50%; text-align: center; vertical-align: top; }
    .firma-box {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 14px 20px 10px;
        background: #f8fafc;
    }
    .firma-line  {
        display: block;
        border-top: 1.5px solid #94a3b8;
        width: 75%;
        margin: 0 auto 8px;
    }
    .firma-name  { font-size: 9.5px; font-weight: bold; color: #0f172a; }
    .firma-role  { font-size: 7.5px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-top: 3px; }

    /* ── Footer ── */
    .footer {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        background: white;
        border-top: 1px solid #f1f5f9;
        padding: 4px 30px;
        font-size: 7px;
        color: #cbd5e1;
    }
    .footer-inner { display: table; width: 100%; }
    .footer-left  { display: table-cell; text-align: left; vertical-align: middle; }
    .footer-right { display: table-cell; text-align: right; vertical-align: middle; }

    .page-break { page-break-after: always; }
</style>
</head>
<body>

@php
    $total         = $registros->count();
    $pendientes    = $registros->where('estado', 'pendiente')->count();
    $confirmados   = $registros->where('estado', 'confirmado')->count();
    $noConfirmados = $registros->where('estado', 'no_confirmado')->count();
    $pctConfirmado = $total > 0 ? round(($confirmados / $total) * 100) : 0;
@endphp

<div class="page">

    <!-- Header -->
    <div class="header-card">
        <div class="header-inner">
            <div class="header-left">
                <div class="header-title">Reporte de Oportunidades de Mejora</div>
                <div class="header-subtitle">LA FARMACIA HOMEOPATICA &nbsp;&mdash;&nbsp; Sistema de Gesti&oacute;n de Calidad</div>
            </div>
            <div class="header-right">
            </div>
        </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-section">
        <table class="kpi-table">
            <tr>
                <!-- Total General -->
                <td class="kpi-card" style="border-top: 3px solid #0ea5e9;">
                    <div class="kpi-card-inner">
                        <div class="kpi-text-col">
                            <div class="kpi-num" style="color:#0ea5e9;">{{ $total }}</div>
                            <div class="kpi-label">Total General</div>
                            <div class="kpi-sub">{{ $pctConfirmado }}% confirmados</div>
                        </div>
                        <div class="kpi-icon-col">
                            <div class="kpi-icon" style="background:#e0f2fe; color:#0369a1;">&#9632;</div>
                        </div>
                    </div>
                    <div class="kpi-bar" style="background:#0ea5e9; width:{{ $pctConfirmado }}%;"></div>
                    <div class="kpi-bar" style="background:#e2e8f0; width:100%; margin-top:-3px;"></div>
                </td>

                <!-- Pendientes -->
                <td class="kpi-card" style="border-top: 3px solid #f59e0b;">
                    <div class="kpi-card-inner">
                        <div class="kpi-text-col">
                            <div class="kpi-num" style="color:#d97706;">{{ $pendientes }}</div>
                            <div class="kpi-label">Pendientes</div>
                            <div class="kpi-sub" style="color:#92400e;">Aguarda Revisi&oacute;n</div>
                        </div>
                        <div class="kpi-icon-col">
                            <div class="kpi-icon" style="background:#fffbeb; color:#d97706;">&#9719;</div>
                        </div>
                    </div>
                    <div class="kpi-bar" style="background:#e2e8f0; width:100%; margin-top:10px;"></div>
                </td>

                <!-- Confirmados -->
                <td class="kpi-card" style="border-top: 3px solid #22c55e;">
                    <div class="kpi-card-inner">
                        <div class="kpi-text-col">
                            <div class="kpi-num" style="color:#16a34a;">{{ $confirmados }}</div>
                            <div class="kpi-label">Confirmados</div>
                            <div class="kpi-sub" style="color:#15803d;">Gesti&oacute;n Exitosa</div>
                        </div>
                        <div class="kpi-icon-col">
                            <div class="kpi-icon" style="background:#f0fdf4; color:#16a34a;">&#10003;</div>
                        </div>
                    </div>
                    <div class="kpi-bar" style="background:#e2e8f0; width:100%; margin-top:10px;"></div>
                </td>

                <!-- No Confirmados -->
                <td class="kpi-card" style="border-top: 3px solid #ef4444;">
                    <div class="kpi-card-inner">
                        <div class="kpi-text-col">
                            <div class="kpi-num" style="color:#dc2626;">{{ $noConfirmados }}</div>
                            <div class="kpi-label">No Confirmados</div>
                            <div class="kpi-sub" style="color:#b91c1c;">Sin Confirmar</div>
                        </div>
                        <div class="kpi-icon-col">
                            <div class="kpi-icon" style="background:#fef2f2; color:#dc2626;">&#10007;</div>
                        </div>
                    </div>
                    <div class="kpi-bar" style="background:#e2e8f0; width:100%; margin-top:10px;"></div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Content -->
    <div class="content">

        <!-- Table section -->
        <div class="sec-title">
            <span></span>Detalle de Oportunidades
        </div>

        <table class="main">
            <thead>
                <tr>
                    <th style="width:22px;">#</th>
                    <th style="width:62px;">N&ordm; Orden</th>
                    <th>Responsable</th>
                    <th style="width:78px;">&Aacute;rea</th>
                    <th style="width:74px;">Categor&iacute;a</th>
                    <th>Descripci&oacute;n</th>
                    <th style="width:82px;">Estado</th>
                    <th style="width:66px;">Fecha Caso</th>
                </tr>
            </thead>
            <tbody>
                @forelse($registros as $r)
                <tr>
                    <td style="color:#cbd5e1; font-size:8.5px;">{{ $r->id }}</td>
                    <td style="font-family: monospace; color:#475569; font-size:8.5px;">{{ $r->no_orden ?? '&mdash;' }}</td>
                    <td style="color:#475569;">{{ $r->nombre_responsable ?? '&mdash;' }}</td>
                    <td style="color:#475569;">{{ $r->area_responsable ?? $r->area }}</td>
                    <td><span class="cat-chip">{{ $r->categoria }}</span></td>
                    <td style="color:#64748b; font-size:9px; word-wrap:break-word; white-space:normal;">{{ $r->descripcion }}</td>
                    <td>
                        <span class="badge badge-{{ $r->estado }}">
                            {{ ucfirst(str_replace('_', ' ', $r->estado)) }}
                        </span>
                    </td>
                    <td style="color:#94a3b8; white-space:nowrap; font-size:8.5px;">
                        {{ $r->fecha_caso ? \Carbon\Carbon::parse($r->fecha_caso)->format('d/m/Y') : '&mdash;' }}
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" style="text-align:center; color:#94a3b8; padding:28px; font-style:italic;">
                        Sin registros para los filtros aplicados.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>


    </div><!-- /content -->

</div><!-- /page -->

<!-- Signatures (fixed bottom) -->
<div class="firma-section">
    <table class="firma-table">
        <tr>
            <td class="firma-cell">
                <div class="firma-box">
                    <span class="firma-line"></span>
                    <div class="firma-name">Quien Socializa</div>
                    <div class="firma-role">L&iacute;der del &Aacute;rea</div>
                </div>
            </td>
            <td class="firma-cell">
                <div class="firma-box">
                    <span class="firma-line"></span>
                    <div class="firma-name">Colaborador que Recibe</div>
                    <div class="firma-role">Firma de Entrega</div>
                </div>
            </td>
        </tr>
    </table>
</div>

<!-- Footer -->
<div class="footer">
    <div class="footer-inner">
        <span class="footer-left">
            GENERADO POR EL SISTEMA CALIDAD V2.0 &mdash; LA FARMACIA HOMEOPATICA
        </span>
        <span class="footer-right">
            {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
        </span>
    </div>
</div>

</body>
</html>
