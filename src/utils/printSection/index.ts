// src/utils/printSection.ts
export function printSection(sectionId: string): void {
  const orig = document.getElementById(sectionId);
  if (!orig) return;

  const clone = orig.cloneNode(true) as HTMLElement;
  clone.style.backgroundColor = '#fff';
  clone.style.boxSizing = 'border-box';
  clone.style.width = '95%';
  clone.style.margin = '20px auto';

  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) return;

  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(el => el.outerHTML)
    .join('');

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        ${styles}
        <style>
          @page { size: A4; margin: 10mm; }
          body { margin: 0; padding: 0; display: flex; justify-content: center; }
          table thead tr {
            background-color: #b20000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          table thead tr th {
            background-color: #b20000 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        </style>
      </head>
      <body></body>
    </html>
  `);
  printWindow.document.close();

  printWindow.document.body.appendChild(clone);
  printWindow.focus();

  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
}
