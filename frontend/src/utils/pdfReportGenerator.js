/**
 * Utilidad profesional para la generación e impresión de Reportes Oficiales en PDF
 * Escuela Gastronómica SENA Risaralda.
 * 
 * Incluye Código QR de validación en recepción para comensales y sellos de agua institucionales.
 */

export const generarReportePDF = ({ reservas, filtros = {}, estadisticas = {} }) => {
  const fechaEmision = new Date().toLocaleString('es-CO', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const total = reservas.length;
  const confirmadas = reservas.filter((r) => r.estado === 'CONFIRMADA').length;
  const canceladas = reservas.filter((r) => r.estado === 'CANCELADA').length;
  const completadas = reservas.filter((r) => r.estado === 'COMPLETADA').length;
  const totalComensales = reservas
    .filter((r) => r.estado === 'CONFIRMADA' || r.estado === 'COMPLETADA')
    .reduce((acc, curr) => acc + (curr.comensales || 0), 0);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor habilita las ventanas emergentes en tu navegador para generar el PDF.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte Oficial de Reservas - SENA Risaralda</title>
      <style>
        @page {
          size: letter landscape;
          margin: 15mm;
        }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #0F172A;
          background: #FFFFFF;
          margin: 0;
          padding: 20px;
          font-size: 10pt;
        }
        .header {
          border-bottom: 3px solid #0B3B36;
          padding-bottom: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-title h1 {
          margin: 0;
          font-size: 16pt;
          color: #0B3B36;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .header-title h2 {
          margin: 4px 0 0 0;
          font-size: 11pt;
          font-weight: 500;
          color: #475569;
        }
        .header-meta {
          text-align: right;
          font-size: 9pt;
          color: #64748B;
        }
        .badge-sena {
          background-color: #39A900;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 8pt;
          display: inline-block;
          margin-bottom: 4px;
        }
        .kpi-container {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }
        .kpi-box {
          flex: 1;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          padding: 10px;
          text-align: center;
          background: #F8FAFC;
        }
        .kpi-value {
          font-size: 16pt;
          font-weight: bold;
          color: #0B3B36;
        }
        .kpi-label {
          font-size: 8pt;
          color: #64748B;
          text-transform: uppercase;
          margin-top: 3px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 9pt;
        }
        th {
          background-color: #0B3B36;
          color: #FFFFFF;
          font-weight: 600;
          text-align: left;
          padding: 8px 10px;
          border: 1px solid #0B3B36;
        }
        td {
          padding: 7px 10px;
          border-bottom: 1px solid #E2E8F0;
          border-left: 1px solid #F1F5F9;
          border-right: 1px solid #F1F5F9;
        }
        tr:nth-child(even) {
          background-color: #F8FAFC;
        }
        .estado-confirmada { color: #15803D; font-weight: bold; }
        .estado-completada { color: #0284C7; font-weight: bold; }
        .estado-cancelada { color: #BE123C; font-weight: bold; }
        .footer-signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          page-break-inside: avoid;
        }
        .signature-box {
          width: 280px;
          border-top: 1px solid #94A3B8;
          text-align: center;
          padding-top: 8px;
          font-size: 9pt;
          color: #475569;
        }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-title">
          <span class="badge-sena">SENA RISARALDA</span>
          <h1>Escuela Gastronómica – Control de Reservas</h1>
          <h2>Centro de Comercio y Servicios | Regional Risaralda</h2>
        </div>
        <div class="header-meta">
          <div><strong>Fecha de emisión:</strong> ${fechaEmision}</div>
          <div><strong>Módulo:</strong> Gestión y Auditoría Oficial</div>
          <div><strong>Instructor a cargo:</strong> Yuri Vargas (Instructor Líder)</div>
        </div>
      </div>

      <div class="kpi-container">
        <div class="kpi-box">
          <div class="kpi-value">${total}</div>
          <div class="kpi-label">Total Reservas</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-value" style="color: #15803D;">${confirmadas}</div>
          <div class="kpi-label">Confirmadas (Activas)</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-value" style="color: #0284C7;">${completadas}</div>
          <div class="kpi-label">Atendidas (En Mesa)</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-value" style="color: #BE123C;">${canceladas}</div>
          <div class="kpi-label">Canceladas</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-value">${totalComensales}</div>
          <div class="kpi-label">Comensales Previstos</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 50px;"># ID</th>
            <th>Cliente & Contacto</th>
            <th>Fecha & Turno</th>
            <th>Mesa Asignada</th>
            <th>Modalidad</th>
            <th>Plato Elegido</th>
            <th>Dieta / Alergia</th>
            <th style="text-align: center;">Cupo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${
            reservas.length === 0
              ? '<tr><td colspan="9" style="text-align: center; padding: 20px;">No hay reservas registradas en este corte.</td></tr>'
              : reservas
                  .map(
                    (r) => `
              <tr>
                <td>#${r.id}</td>
                <td><strong>${r.clienteNombre}</strong><br><small style="color: #64748B;">${r.clienteTelefono}</small></td>
                <td>${r.fecha}<br><small style="color: #64748B;">${r.turno?.nombre || 'General'}</small></td>
                <td>Mesa #${r.mesa?.numero || '-'} (${r.mesa?.ubicacion || 'Salón'})</td>
                <td>${r.tipoConsumo || 'En Sitio'}</td>
                <td><strong>${r.menuSeleccionado || 'Menú de Autor'}</strong></td>
                <td style="color: ${r.preferenciaDietaria && !r.preferenciaDietaria.includes('Estándar') ? '#BE123C' : '#475569'}; font-weight: ${r.preferenciaDietaria && !r.preferenciaDietaria.includes('Estándar') ? 'bold' : 'normal'};">
                  ${r.preferenciaDietaria || 'Estándar'}
                </td>
                <td style="text-align: center; font-weight: bold;">${r.comensales}</td>
                <td class="${r.estado === 'CONFIRMADA' ? 'estado-confirmada' : r.estado === 'COMPLETADA' ? 'estado-completada' : 'estado-cancelada'}">
                  ${r.estado}
                </td>
              </tr>
            `
                  )
                  .join('')
          }
        </tbody>
      </table>

      <div class="footer-signatures">
        <div class="signature-box">
          <strong>Instructor Líder de Gastronomía</strong><br>
          Coordinación de Formación Profesional
        </div>
        <div class="signature-box">
          <strong>Administración de Restaurante Escuela</strong><br>
          SENA Centro de Comercio y Servicios
        </div>
      </div>

      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

/**
 * Genera el comprobante individual en PDF para el comensal con CÓDIGO QR de validación en recepción.
 */
export const generarComprobanteCliente = (reserva) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor habilita las ventanas emergentes para ver el comprobante.');
    return;
  }

  const codigoValidacion = `SENA-RES-${String(reserva.id).padStart(5, '0')}-${reserva.fecha.replace(/-/g, '')}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(codigoValidacion)}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Comprobante de Reserva - SENA Risaralda</title>
      <style>
        @page { size: portrait; margin: 15mm; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0F172A; padding: 20px; background: #FFFFFF; }
        .ticket { max-width: 480px; margin: 0 auto; border: 2px solid #0B3B36; border-radius: 12px; padding: 25px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .logo-sena { color: #39A900; font-weight: 800; font-size: 13pt; letter-spacing: 1.5px; text-transform: uppercase; }
        .title { color: #0B3B36; font-size: 18pt; font-weight: 800; margin: 4px 0 16px 0; }
        .row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #E2E8F0; font-size: 9.5pt; }
        .label { color: #64748B; font-weight: 500; }
        .value { font-weight: 700; color: #0F172A; text-align: right; }
        .qr-section { text-align: center; margin-top: 20px; padding: 15px; background: #F8FAFC; border-radius: 8px; border: 1px dashed #CBD5E1; }
        .qr-image { width: 130px; height: 130px; display: block; margin: 0 auto 10px auto; border-radius: 6px; }
        .qr-code-text { font-family: monospace; font-size: 10pt; font-weight: bold; letter-spacing: 1.5px; color: #0B3B36; }
        .footer { font-size: 8pt; color: #94A3B8; text-align: center; margin-top: 18px; line-height: 1.4; }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="logo-sena">SENA RISARALDA</div>
            <div class="title">Boleto de Reserva</div>
          </div>
          <div style="background: #0B3B36; color: white; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 10pt;">
            #SENA-${String(reserva.id).padStart(5, '0')}
          </div>
        </div>
        
        <div class="row">
          <span class="label">Titular de la Reserva:</span>
          <span class="value">${reserva.clienteNombre}</span>
        </div>
        <div class="row">
          <span class="label">Celular de Contacto:</span>
          <span class="value">${reserva.clienteTelefono}</span>
        </div>
        <div class="row">
          <span class="label">Fecha Programada:</span>
          <span class="value">${reserva.fecha}</span>
        </div>
        <div class="row">
          <span class="label">Turno de Atención:</span>
          <span class="value">${reserva.turno?.nombre} (${reserva.turno?.horaInicio} - ${reserva.turno?.horaFin})</span>
        </div>
        <div class="row">
          <span class="label">Ubicación y Mesa:</span>
          <span class="value">Mesa #${reserva.mesa?.numero} • ${reserva.mesa?.ubicacion}</span>
        </div>
        <div class="row">
          <span class="label">Comensales:</span>
          <span class="value">${reserva.comensales} personas</span>
        </div>
        <div class="row">
          <span class="label">Modalidad:</span>
          <span class="value">${reserva.tipoConsumo || 'En Sitio'}</span>
        </div>
        <div class="row">
          <span class="label">Plato Seleccionado:</span>
          <span class="value" style="color: #0B3B36;">${reserva.menuSeleccionado || 'Menú Pedagógico'}</span>
        </div>
        <div class="row">
          <span class="label">Requerimiento Dietario:</span>
          <span class="value" style="color: ${reserva.preferenciaDietaria && !reserva.preferenciaDietaria.includes('Estándar') ? '#BE123C' : '#0F172A'};">
            ${reserva.preferenciaDietaria || 'Estándar'}
          </span>
        </div>

        {/* Sección Código QR */}
        <div class="qr-section">
          <img src="${qrUrl}" alt="Código QR Validación" class="qr-image" />
          <div class="qr-code-text">* ${codigoValidacion} *</div>
          <div style="font-size: 7.5pt; color: #64748B; margin-top: 4px;">Escanear en recepción para confirmar asistencia y mesa</div>
        </div>

        <div class="footer">
          Escuela Gastronómica del SENA Centro de Comercio y Servicios • Regional Risaralda.<br>
          Presentar este código QR al momento de ingresar.
        </div>
      </div>
      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
