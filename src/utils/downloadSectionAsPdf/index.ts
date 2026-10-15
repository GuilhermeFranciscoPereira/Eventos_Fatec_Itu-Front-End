export async function downloadSectionAsPdf(sectionId: string, filename = 'Lista_de_Presença.pdf'): Promise<void> {
  const section = document.getElementById(sectionId);
  if (!section) return;

  // Both libraries are heavy and only needed here, so they load on the click instead of with the page.
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);

  const clone = section.cloneNode(true) as HTMLElement;
  clone.style.position = 'fixed';
  clone.style.left = '-9999px';
  clone.style.backgroundColor = '#fff';
  clone.style.boxShadow = 'none';
  clone.querySelectorAll<HTMLElement>('*').forEach(el => { el.style.boxShadow = 'none' });
  document.body.appendChild(clone);

  const canvas = await html2canvas(clone, {
    useCORS: true,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: -window.scrollY,
    width: clone.scrollWidth,
    height: clone.scrollHeight,
  });

  document.body.removeChild(clone);

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentW = pageW - margin * 2;
  const contentH = pageH - margin * 2;
  const imgH = (canvas.height * contentW) / canvas.width;

  let remainingHeight = imgH;
  let y = margin;
  pdf.addImage(imgData, 'PNG', margin, y, contentW, imgH);
  remainingHeight -= contentH;

  while (remainingHeight > 0) {
    pdf.addPage();
    y = margin - (imgH - remainingHeight);
    pdf.addImage(imgData, 'PNG', margin, y, contentW, imgH);
    remainingHeight -= contentH;
  }

  pdf.save(filename);
}
