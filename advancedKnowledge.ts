export interface AdvancedKnowledge {
  subject: string;
  topic: string;
  content: string;
  tips: string[];
}

export const ADVANCED_KNOWLEDGE: AdvancedKnowledge[] = [
  // VẬT LÍ
  {
    subject: 'Vật lí',
    topic: 'Năng lượng cơ học',
    content: 'Vận dụng định luật bảo toàn cơ năng để giải các bài toán va chạm và chuyển động trong trọng trường. Hiểu rõ sự chuyển hóa giữa động năng và thế năng trong các hệ kín.',
    tips: [
      'Luôn xác định mốc thế năng trước khi tính toán.',
      'Trong các bài toán có ma sát, cơ năng không bảo toàn, độ biến thiên cơ năng bằng công của lực ma sát.',
      'Chú ý đơn vị: Khối lượng (kg), Vận tốc (m/s), Độ cao (m).'
    ]
  },
  {
    subject: 'Vật lí',
    topic: 'Ánh sáng',
    content: 'Giải quyết các bài toán hệ thấu kính, hiện tượng khúc xạ phức tạp và ứng dụng của quang hình học trong đời sống như mắt và các dụng cụ quang học.',
    tips: [
      'Nắm vững công thức thấu kính: 1/f = 1/d + 1/d\'.',
      'Quy ước dấu: Ảnh thật d\' > 0, ảnh ảo d\' < 0; Thấu kính hội tụ f > 0, thấu kính phân kỳ f < 0.',
      'Vẽ hình chính xác giúp kiểm tra lại kết quả tính toán.'
    ]
  },
  {
    subject: 'Vật lí',
    topic: 'Điện',
    content: 'Phân tích mạch điện hỗn hợp phức tạp, tính toán công suất cực đại và hiệu suất của nguồn điện. Vận dụng định luật Joule-Lenz cho các thiết bị nhiệt.',
    tips: [
      'Sử dụng phương pháp chập các điểm có cùng điện thế để đơn giản hóa mạch điện.',
      'Công thức tính công suất: P = U.I = I^2.R = U^2/R.',
      'Hiệu suất H = P_ích / P_tp * 100%.'
    ]
  },
  {
    subject: 'Vật lí',
    topic: 'Điện từ',
    content: 'Hiểu sâu về cảm ứng điện từ, quy tắc Lenz và ứng dụng trong máy biến thế, truyền tải điện năng đi xa để giảm hao phí.',
    tips: [
      'Công suất hao phí: Php = R * (P^2 / U^2). Để giảm Php, phương pháp hiệu quả nhất là tăng U.',
      'Tỉ số máy biến thế: U1/U2 = N1/N2.',
      'Quy tắc nắm tay phải và bàn tay trái cần được thực hành thường xuyên để tránh nhầm lẫn.'
    ]
  },
  {
    subject: 'Vật lí',
    topic: 'Năng lượng với cuộc sống',
    content: 'Đánh giá tác động của các nguồn năng lượng khác nhau đến môi trường và xu hướng phát triển năng lượng bền vững trong tương lai.',
    tips: [
      'Phân biệt rõ năng lượng tái tạo (gió, mặt trời, thủy triều) và không tái tạo (than đá, dầu mỏ).',
      'Hiểu về hiệu ứng nhà kính và vai trò của việc tiết kiệm năng lượng.'
    ]
  },

  // HÓA HỌC
  {
    subject: 'Hóa học',
    topic: 'Kim loại và phi kim',
    content: 'Giải các bài toán hỗn hợp kim loại tác dụng với acid, bài toán khử oxit kim loại bằng C hoặc CO và các quy trình sản xuất gang, thép.',
    tips: [
      'Sử dụng phương pháp bảo toàn electron để giải nhanh các bài toán oxi hóa - khử.',
      'Nhớ kỹ dãy hoạt động hóa học: Khi Nào Ba Cần May Áo Giáp Sắt Nhớ Sang Phố Hỏi Cửa Hàng Á Phi Âu.',
      'Kim loại đứng trước H mới đẩy được H ra khỏi dung dịch acid loãng (trừ HNO3, H2SO4 đặc).'
    ]
  },
  {
    subject: 'Hóa học',
    topic: 'Hydrocarbon và nhiên liệu',
    content: 'Xác định công thức phân tử dựa trên phản ứng cháy, phản ứng cộng và hiểu về cấu trúc mạch carbon (thẳng, nhánh, vòng).',
    tips: [
      'Methane (CH4) phản ứng thế, Ethylene (C2H4) và Acetylene (C2H2) phản ứng cộng làm mất màu dung dịch Bromine.',
      'Công thức tính số mol qua thể tích (đktc): n = V / 22.4.',
      'Tỉ lệ mol CO2 và H2O giúp xác định loại hydrocarbon.'
    ]
  },
  {
    subject: 'Hóa học',
    topic: 'Ethylic alcohol – Acetic acid',
    content: 'Vận dụng phản ứng lên men, phản ứng ester hóa và tính toán độ rượu, nồng độ dung dịch trong các bài toán thực tế.',
    tips: [
      'Phản ứng ester hóa là phản ứng thuận nghịch, cần xúc tác H2SO4 đặc và đun nóng.',
      'Độ rượu = (V_rượu nguyên chất / V_dung dịch) * 100.',
      'Acid acetic làm quỳ tím hóa đỏ, tác dụng với kim loại trước H, oxit base, base và muối carbonate.'
    ]
  },
  {
    subject: 'Hóa học',
    topic: 'Lipid – Carbohydrate – Protein – Polymer',
    content: 'Hiểu về cấu trúc và tính chất hóa học đặc trưng của các hợp chất hữu cơ quan trọng trong đời sống và các loại vật liệu polymer hiện đại.',
    tips: [
      'Glucose có phản ứng tráng gương, tinh bột làm xanh iodine.',
      'Phản ứng thủy phân chất béo tạo glycerol và xà phòng.',
      'Protein bị đông tụ bởi nhiệt hoặc acid/kiềm.'
    ]
  },
  {
    subject: 'Hóa học',
    topic: 'Khai thác tài nguyên từ vỏ Trái Đất',
    content: 'Quy trình tinh chế quặng, chưng cất phân đoạn dầu mỏ và các biện pháp bảo vệ tài nguyên khoáng sản.',
    tips: [
      'Chưng cất dầu mỏ dựa trên sự khác nhau về nhiệt độ sôi của các hydrocarbon.',
      'Hiểu về chỉ số octane của xăng và các sản phẩm phụ của dầu mỏ.'
    ]
  },

  // SINH HỌC
  {
    subject: 'Sinh học',
    topic: 'DNA – RNA – Phiên mã – Dịch mã',
    content: 'Tính toán các thông số của gene (chiều dài, số nucleotide, số liên kết hydrogen) và cơ chế truyền đạt thông tin di truyền ở cấp độ phân tử.',
    tips: [
      'Công thức: L = (N/2) * 3.4 Å; H = 2A + 3G.',
      'Nguyên tắc bổ sung: A-T, G-C (DNA); A-U, G-C (RNA).',
      'Một mã di truyền (codon) gồm 3 nucleotide quy định 1 amino acid.'
    ]
  },
  {
    subject: 'Sinh học',
    topic: 'Quy luật Mendel',
    content: 'Giải các bài toán lai một cặp và hai cặp tính trạng, xác định kiểu gene của bố mẹ dựa trên tỉ lệ kiểu hình ở đời con.',
    tips: [
      'Tỉ lệ 3:1 ở F2 cho thấy bố mẹ dị hợp Aa x Aa.',
      'Tỉ lệ 1:1 là kết quả của phép lai phân tích Aa x aa.',
      'Sử dụng sơ đồ kẻ ô (Punnett square) để tránh sai sót khi tổ hợp giao tử.'
    ]
  },
  {
    subject: 'Sinh học',
    topic: 'Nguyên phân – Giảm phân – NST',
    content: 'Phân tích diễn biến của NST qua các kỳ phân bào, các dạng đột biến cấu trúc và số lượng NST và ứng dụng trong chọn giống.',
    tips: [
      'Số tế bào con sau k lần nguyên phân = 2^k.',
      'Giảm phân tạo giao tử có bộ NST giảm đi một nửa (n).',
      'Đột biến thể ba (2n+1) như hội chứng Down (3 NST 21).'
    ]
  }
];
