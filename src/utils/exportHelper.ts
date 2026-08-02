import { Complaint } from '../types';

export function exportToCSV(complaints: Complaint[], filename: string = 'rural_complaints_report.csv') {
  const headers = ['Complaint ID', 'Title', 'Category', 'Village', 'Ward', 'Priority', 'Status', 'Citizen Name', 'Date Registered', 'Assigned Officer'];
  
  const rows = complaints.map(c => [
    `"${c.id}"`,
    `"${c.title.replace(/"/g, '""')}"`,
    `"${c.category}"`,
    `"${c.village}"`,
    `"${c.wardNumber}"`,
    `"${c.priority}"`,
    `"${c.status}"`,
    `"${c.citizenName}"`,
    `"${c.createdAt}"`,
    `"${c.assignedOfficer ? c.assignedOfficer.name : 'Unassigned'}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(complaints: Complaint[], filename: string = 'rural_complaints_export.xls') {
  // Simple XML template compatible with Excel
  let xml = `<?xml version="1.0"?>
  <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
   xmlns:o="urn:schemas-microsoft-com:office:office"
   xmlns:x="urn:schemas-microsoft-com:office:excel"
   xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
   <Worksheet ss:Name="Complaints">
    <Table>
     <Row>
      <Cell><Data ss:Type="String">ID</Data></Cell>
      <Cell><Data ss:Type="String">Title</Data></Cell>
      <Cell><Data ss:Type="String">Category</Data></Cell>
      <Cell><Data ss:Type="String">Village</Data></Cell>
      <Cell><Data ss:Type="String">Ward</Data></Cell>
      <Cell><Data ss:Type="String">Priority</Data></Cell>
      <Cell><Data ss:Type="String">Status</Data></Cell>
      <Cell><Data ss:Type="String">Citizen</Data></Cell>
      <Cell><Data ss:Type="String">Date</Data></Cell>
     </Row>`;

  complaints.forEach(c => {
    xml += `
     <Row>
      <Cell><Data ss:Type="String">${c.id}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(c.title)}</Data></Cell>
      <Cell><Data ss:Type="String">${c.category}</Data></Cell>
      <Cell><Data ss:Type="String">${c.village}</Data></Cell>
      <Cell><Data ss:Type="String">${c.wardNumber}</Data></Cell>
      <Cell><Data ss:Type="String">${c.priority}</Data></Cell>
      <Cell><Data ss:Type="String">${c.status}</Data></Cell>
      <Cell><Data ss:Type="String">${escapeXml(c.citizenName)}</Data></Cell>
      <Cell><Data ss:Type="String">${c.createdAt}</Data></Cell>
     </Row>`;
  });

  xml += `
    </Table>
   </Worksheet>
  </Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
