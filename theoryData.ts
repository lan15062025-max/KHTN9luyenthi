export interface TheorySummary {
  subject: string;
  topic: string;
  summary: string[];
  keyFormulas?: string[];
}

export const THEORY_SUMMARIES: TheorySummary[] = [
  // VẬT LÍ
  {
    subject: 'Vật lí',
    topic: 'Năng lượng cơ học',
    summary: [
      'Động năng (Wđ): Năng lượng vật có được do chuyển động. Wđ = 1/2 * m * v^2.',
      'Thế năng trọng trường (Wt): Năng lượng vật có được do vị trí so với mặt đất. Wt = m * g * h.',
      'Cơ năng (W): Tổng động năng và thế năng. W = Wđ + Wt.',
      'Định luật bảo toàn cơ năng: Trong hệ kín không có ma sát, cơ năng được bảo toàn.'
    ],
    keyFormulas: ['Wđ = 1/2mv^2', 'Wt = mgh', 'W = Wđ + Wt = const']
  },
  {
    subject: 'Vật lí',
    topic: 'Ánh sáng',
    summary: [
      'Khúc xạ ánh sáng: Tia sáng bị gãy khúc khi truyền qua mặt phân cách giữa hai môi trường.',
      'Thấu kính hội tụ: Cho ảnh thật (ngược chiều) hoặc ảnh ảo (cùng chiều, lớn hơn vật).',
      'Thấu kính phân kỳ: Luôn cho ảnh ảo, cùng chiều và nhỏ hơn vật.',
      'Mắt: Thấu kính mắt là thấu kính hội tụ, ảnh hiện trên màng lưới.'
    ],
    keyFormulas: ['1/f = 1/d + 1/d\'', 'k = -d\'/d', 'P = 1/f (độ tụ)']
  },
  {
    subject: 'Vật lí',
    topic: 'Điện',
    summary: [
      'Định luật Ohm: I = U/R.',
      'Đoạn mạch nối tiếp: I = I1 = I2; U = U1 + U2; R = R1 + R2.',
      'Đoạn mạch song song: I = I1 + I2; U = U1 = U2; 1/R = 1/R1 + 1/R2.',
      'Định luật Joule-Lenz: Q = I^2 * R * t.'
    ],
    keyFormulas: ['I = U/R', 'P = U.I', 'Q = I^2.R.t']
  },
  {
    subject: 'Vật lí',
    topic: 'Điện từ',
    summary: [
      'Từ trường: Tồn tại xung quanh nam châm hoặc dòng điện.',
      'Cảm ứng điện từ: Xuất hiện dòng điện cảm ứng khi số đường sức từ xuyên qua cuộn dây biến thiên.',
      'Dòng điện xoay chiều: Dòng điện luân phiên đổi chiều.',
      'Máy biến thế: Thiết bị biến đổi hiệu điện thế xoay chiều.'
    ],
    keyFormulas: ['U1/U2 = N1/N2', 'Php = R * (P^2 / U^2)']
  },

  // HÓA HỌC
  {
    subject: 'Hóa học',
    topic: 'Kim loại và phi kim',
    summary: [
      'Tính chất hóa học kim loại: Tác dụng với phi kim, acid, dung dịch muối.',
      'Dãy hoạt động hóa học: K, Na, Ba, Ca, Mg, Al, Zn, Fe, Ni, Sn, Pb, (H), Cu, Hg, Ag, Pt, Au.',
      'Gang và Thép: Hợp kim của sắt với carbon và một số nguyên tố khác.',
      'Sự ăn mòn kim loại: Phá hủy kim loại do tác động của môi trường.'
    ]
  },
  {
    subject: 'Hóa học',
    topic: 'Hydrocarbon và nhiên liệu',
    summary: [
      'Methane (CH4): Hydrocarbon no, phản ứng đặc trưng là phản ứng thế.',
      'Ethylene (C2H4): Có liên kết đôi, phản ứng đặc trưng là phản ứng cộng.',
      'Acetylene (C2H2): Có liên kết ba, phản ứng cộng.',
      'Nhiên liệu: Chất cháy được, khi cháy tỏa nhiệt và phát sáng.'
    ]
  },
  {
    subject: 'Hóa học',
    topic: 'Ethylic alcohol – Acetic acid',
    summary: [
      'Ethylic alcohol (C2H5OH): Tác dụng với Na, phản ứng cháy, phản ứng lên men giấm.',
      'Acetic acid (CH3COOH): Có tính acid, tác dụng với rượu tạo ester.',
      'Mối liên hệ: Ethylene -> Rượu etylic -> Acid acetic -> Ethyl acetate.'
    ]
  },

  // SINH HỌC
  {
    subject: 'Sinh học',
    topic: 'DNA – RNA – Phiên mã – Dịch mã',
    summary: [
      'DNA: Cấu trúc xoắn kép, gồm 4 loại nucleotide A, T, G, C.',
      'RNA: Cấu trúc mạch đơn, gồm 4 loại nucleotide A, U, G, C.',
      'Phiên mã: Tổng hợp RNA từ mạch khuôn DNA.',
      'Dịch mã: Tổng hợp chuỗi polypeptide (protein) từ mRNA.'
    ]
  },
  {
    subject: 'Sinh học',
    topic: 'Quy luật Mendel',
    summary: [
      'Lai một cặp tính trạng: F2 phân li tỉ lệ 3 trội : 1 lặn.',
      'Lai hai cặp tính trạng: F2 phân li tỉ lệ 9:3:3:1.',
      'Biến dị tổ hợp: Sự xuất hiện các kiểu hình mới ở đời con do sự tổ hợp lại các gene của bố mẹ.'
    ]
  },
  {
    subject: 'Sinh học',
    topic: 'Nguyên phân – Giảm phân – NST',
    summary: [
      'Nguyên phân: Từ 1 tế bào (2n) tạo ra 2 tế bào con (2n).',
      'Giảm phân: Từ 1 tế bào (2n) tạo ra 4 giao tử (n).',
      'Nhiễm sắc thể: Cấu trúc mang gene, có khả năng tự nhân đôi và phân li.'
    ]
  }
];
