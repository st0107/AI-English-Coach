export const downloadCertificate = (
  userName: string,
  courseTitle: string,
  dateEarned: string
) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer border
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 15;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  // Inner border
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 5;
  ctx.strokeRect(70, 70, canvas.width - 140, canvas.height - 140);

  // Corner decorations
  ctx.fillStyle = '#1e293b';
  const cornerSize = 40;
  // Top-left
  ctx.fillRect(50, 50, cornerSize, cornerSize);
  // Top-right
  ctx.fillRect(canvas.width - 50 - cornerSize, 50, cornerSize, cornerSize);
  // Bottom-left
  ctx.fillRect(50, canvas.height - 50 - cornerSize, cornerSize, cornerSize);
  // Bottom-right
  ctx.fillRect(canvas.width - 50 - cornerSize, canvas.height - 50 - cornerSize, cornerSize, cornerSize);

  // Logo / Icon placeholder (top center)
  ctx.fillStyle = '#4f46e5';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 220, 60, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 60px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AEC', canvas.width / 2, 220); // AI English Coach

  // Main Text
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 72px "Inter", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('CERTIFICATE OF ACHIEVEMENT', canvas.width / 2, 400);

  ctx.fillStyle = '#475569';
  ctx.font = '36px "Inter", sans-serif';
  ctx.fillText('THIS ACKNOWLEDGES THAT', canvas.width / 2, 500);

  // Student Name
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 80px "Space Grotesk", sans-serif';
  ctx.fillText(userName.toUpperCase(), canvas.width / 2, 620);
  
  // Underline Student Name
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  const textWidth = ctx.measureText(userName.toUpperCase()).width;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - textWidth / 2 - 50, 640);
  ctx.lineTo(canvas.width / 2 + textWidth / 2 + 50, 640);
  ctx.stroke();

  ctx.fillStyle = '#475569';
  ctx.font = '36px "Inter", sans-serif';
  ctx.fillText('HAS SUCCESSFULLY COMPLETED THE REQUIREMENTS FOR', canvas.width / 2, 740);

  // Course Title
  ctx.fillStyle = '#4f46e5';
  ctx.font = 'bold 56px "Inter", sans-serif';
  ctx.fillText(courseTitle.toUpperCase(), canvas.width / 2, 850);

  // Bottom section (Date, Signature)
  ctx.fillStyle = '#0f172a';
  ctx.font = '32px "Inter", sans-serif';
  
  // Date
  ctx.fillText('Date Earned', 400, 1000);
  ctx.font = 'bold 32px "Inter", sans-serif';
  ctx.fillText(new Date(dateEarned).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }), 400, 1040);
  ctx.beginPath();
  ctx.moveTo(250, 950);
  ctx.lineTo(550, 950);
  ctx.stroke();

  // Signature
  ctx.font = '32px "Inter", sans-serif';
  ctx.fillText('AI English Coach', canvas.width - 400, 1000);
  ctx.font = 'italic 48px "Inter", serif';
  ctx.fillStyle = '#4f46e5';
  ctx.fillText('AI Director', canvas.width - 400, 1040);
  
  ctx.strokeStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(canvas.width - 550, 950);
  ctx.lineTo(canvas.width - 250, 950);
  ctx.stroke();

  // Convert to image and download
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `${courseTitle.replace(/\s+/g, '_')}_Certificate.png`;
  link.href = dataUrl;
  link.click();
};
