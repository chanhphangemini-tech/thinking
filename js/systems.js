/**
 * SYSTEMA - Systems Thinking Training Logic
 */

const quizData = {
  1: {
    title: "QUIZ GIAI ĐOẠN 1",
    subtitle: "Tư Duy Phi Tuyến Tính & Phản Hồi — Cần 4/5 để pass",
    questions: [
      {
        q: "Tại sao tư duy 'Nguyên nhân - Kết quả' (tuyến tính) thường thất bại trong các hệ thống phức tạp?",
        opts: ["Vì nó quá đơn giản để hiểu", "Vì trong hệ thống, một kết quả có thể quay lại tác động vào nguyên nhân (vòng lặp phản hồi)", "Vì hệ thống không có nguyên nhân", "Vì kết quả luôn xảy ra trước nguyên nhân"],
        c: 1,
        e: "Trong hệ thống, các thành phần tương tác lẫn nhau. Một hành động không chỉ tạo ra kết quả mà còn tạo ra phản hồi (feedback), làm thay đổi chính nguyên nhân ban đầu. Tư duy tuyến tính bỏ qua các vòng lặp này."
      },
      {
        q: "Một 'Vòng lặp Phản hồi Cân bằng' (Balancing Loop) có đặc điểm gì?",
        opts: ["Thúc đẩy sự tăng trưởng không ngừng", "Đưa hệ thống về trạng thái ổn định hoặc mục tiêu", "Gây ra sự sụp đổ nhanh chóng", "Làm hệ thống mất kiểm soát"],
        c: 1,
        e: "Vòng lặp cân bằng hoạt động như một bộ ổn định (như máy điều hòa nhiệt độ). Nó nhận diện sự khác biệt giữa trạng thái hiện tại và mục tiêu, sau đó điều chỉnh để thu hẹp khoảng cách đó."
      },
      {
        q: "Hiện tượng 'Trễ' (Delay) trong hệ thống gây ra rủi ro gì lớn nhất?",
        opts: ["Làm hệ thống chạy nhanh hơn", "Khiến người vận hành phản ứng quá đà (overshoot) vì không thấy kết quả ngay lập tức", "Làm triệt tiêu mọi phản hồi", "Giúp hệ thống ổn định hơn"],
        c: 1,
        e: "Vì có độ trễ giữa hành động và kết quả, chúng ta thường tưởng rằng hành động chưa đủ mạnh nên tiếp tục tăng cường. Khi kết quả ập đến, nó sẽ vượt quá mức cần thiết, gây ra sự dao động mạnh hoặc sụp đổ."
      },
      {
        q: "Điểm đòn bẩy (Leverage Point) trong hệ thống là nơi mà:",
        opts: ["Cần dùng nhiều sức lực nhất để thay đổi", "Một thay đổi nhỏ có thể tạo ra tác động lớn và bền vững lên toàn bộ hệ thống", "Hệ thống dễ bị hỏng nhất", "Nguyên nhân và kết quả gần nhau nhất về mặt thời gian"],
        c: 1,
        e: "Tìm ra điểm đòn bẩy là mục tiêu tối thượng của tư duy hệ thống. Thay vì giải quyết triệu chứng bề mặt, ta tìm điểm mấu chốt trong cấu trúc để thay đổi hành vi của cả hệ thống."
      },
      {
        q: "Câu nói 'Triệu chứng của hôm nay đến từ giải pháp của hôm qua' ám chỉ điều gì?",
        opts: ["Giải pháp cũ luôn luôn sai", "Các giải pháp ngắn hạn thường tạo ra hệ quả không lường trước trong tương lai", "Hệ thống không bao giờ thay đổi", "Chúng ta nên ngừng giải quyết vấn đề"],
        c: 1,
        e: "Đây là một định luật của Peter Senge. Khi ta giải quyết vấn đề bằng cách tác động vào triệu chứng mà không thay đổi cấu trúc, vấn đề sẽ quay trở lại dưới một hình thái khác, thường là nghiêm trọng hơn."
      }
    ]
  },
  2: {
    title: "QUIZ GIAI ĐOẠN 2",
    subtitle: "Cấu Trúc Hệ Thống & Archetypes — Cần 4/5 để pass",
    questions: [
      {
        q: "Archetype 'Sửa lỗi gây họa' (Fixes that Fail) mô tả tình huống nào?",
        opts: ["Sửa xong thì hệ thống hỏng hẳn", "Giải pháp ngắn hạn làm giảm triệu chứng ngay lập tức nhưng gây ra hệ quả phụ làm vấn đề tệ hơn trong dài hạn", "Không thể tìm ra cách sửa lỗi", "Lỗi tự biến mất mà không cần sửa"],
        c: 1,
        e: "Điển hình là việc vay nợ để trả nợ. Bạn bớt áp lực ngay lúc đó, nhưng lãi suất làm khoản nợ phình to hơn, khiến bạn càng phải vay nhiều hơn trong tương lai."
      },
      {
        q: "Trong archetype 'Chuyển gánh nặng' (Shifting the Burden), 'gánh nặng' được chuyển từ đâu sang đâu?",
        opts: ["Từ người này sang người khác", "Từ giải pháp căn cơ sang giải pháp triệu chứng", "Từ giải pháp triệu chứng (ngắn hạn) sang giải pháp căn cơ (dài hạn)", "Từ giải pháp căn cơ sang các tác nhân bên ngoài"],
        c: 3,
        e: "Ta quá phụ thuộc vào các giải pháp bên ngoài hoặc ngắn hạn (như thuốc giảm đau), làm suy yếu khả năng tự giải quyết vấn đề gốc rễ của hệ thống (như sức đề kháng tự nhiên)."
      },
      {
        q: "Làm thế nào để phá vỡ vòng lặp 'Cạnh tranh hủy diệt' (Escalation)?",
        opts: ["Tấn công mạnh hơn đối thủ", "Cả hai bên cùng đồng thuận dừng lại hoặc thay đổi mục tiêu từ 'thắng đối thủ' sang 'cùng phát triển'", "Rút lui hoàn toàn", "Phớt lờ hành động của đối thủ"],
        c: 1,
        e: "Vòng lặp leo thang (như chạy đua vũ trang) chỉ dừng lại khi các bên nhận ra rằng cuộc đua này làm cả hai cùng kiệt quệ và quyết định hợp tác hoặc thiết lập luật chơi mới."
      },
      {
        q: "Mô hình 'Tảng băng' (Iceberg Model) giúp chúng ta thấy điều gì?",
        opts: ["Thấy phần nổi của vấn đề là quan trọng nhất", "Đi sâu từ Sự kiện -> Mẫu hình -> Cấu trúc -> Mô hình tâm trí", "Thấy rằng vấn đề luôn luôn lạnh lẽo", "Hệ thống luôn luôn chìm dưới nước"],
        c: 1,
        e: "Đa số mọi người chỉ phản ứng với Sự kiện (phần nổi). Tư duy hệ thống yêu cầu ta đào sâu xuống Cấu trúc và Mô hình tâm trí để tạo ra thay đổi thực sự."
      },
      {
        q: "Tại sao các hệ thống thường có xu hướng 'kháng cự' lại sự thay đổi?",
        opts: ["Vì hệ thống có ý chí riêng", "Vì các vòng lặp phản hồi cân bằng nội tại cố gắng giữ hệ thống ở trạng thái cũ", "Vì hệ thống không muốn tiến hóa", "Vì sự thay đổi luôn luôn xấu"],
        c: 1,
        e: "Mọi hệ thống lâu đời đều có các cơ chế tự cân bằng mạnh mẽ. Nếu ta tác động vào hệ thống mà không hiểu các cơ chế này, chúng sẽ phản kháng để đưa mọi thứ về nguyên trạng."
      }
    ]
  },
  3: {
    title: "QUIZ GIAI ĐOẠN 3",
    subtitle: "Mô Hình Tâm Trí & Đòn Bẩy — Cần 4/5 để pass",
    questions: [
      {
        q: "Mô hình tâm trí (Mental Models) có vai trò gì trong hệ thống?",
        opts: ["Nó là những suy nghĩ ngẫu nhiên", "Nó là những giả định và niềm tin định hình cách chúng ta nhìn nhận và tương tác với thế giới", "Nó không ảnh hưởng đến cấu trúc hệ thống", "Nó chỉ quan trọng đối với cá nhân, không phải tổ chức"],
        c: 1,
        e: "Mô hình tâm trí là tầng sâu nhất của tảng băng. Nếu không thay đổi cách chúng ta nghĩ về vấn đề, mọi thay đổi về cấu trúc hay quy trình đều sẽ sớm thất bại."
      },
      {
        q: "Theo Donella Meadows, điểm đòn bẩy nào có tác động MẠNH NHẤT?",
        opts: ["Thay đổi các con số (như thuế, trợ cấp)", "Thay đổi các hằng số vật lý", "Thay đổi mục tiêu của hệ thống (Goal) hoặc thay đổi Mindset/Paradigm tạo ra hệ thống", "Thay đổi các dòng chảy vật chất"],
        c: 2,
        e: "Thay đổi mục tiêu hoặc mindset sẽ thay đổi toàn bộ các vòng lặp phản hồi, cấu trúc và hành vi bên trên nó. Đây là đòn bẩy cấp độ cao nhất."
      },
      {
        q: "Tại sao việc 'Thay đổi các con số' (ví dụ: tăng lương, giảm giá) thường là điểm đòn bẩy thấp?",
        opts: ["Vì con người không thích tiền", "Vì chúng thường không làm thay đổi cấu trúc hay logic vận hành cốt lõi của hệ thống", "Vì số liệu luôn luôn sai", "Vì nó quá dễ thực hiện"],
        c: 1,
        e: "Các con số chỉ là các tham số. Chúng có thể tạo ra thay đổi ngắn hạn nhưng nếu cấu trúc vẫn giữ nguyên, hệ thống sẽ sớm quay lại trạng thái cũ hoặc tìm cách 'lách' các con số đó."
      },
      {
        q: "Kỹ thuật 'Thang suy luận' (Ladder of Inference) giúp gì cho tư duy hệ thống?",
        opts: ["Giúp leo trèo nhanh hơn", "Giúp nhận diện cách chúng ta nhảy từ dữ liệu khách quan đến kết luận chủ quan và hành động sai lầm", "Giúp xây dựng cấu trúc vật lý cho hệ thống", "Giúp thuyết phục người khác tin vào mình"],
        c: 1,
        e: "Bằng cách nhận ra mình đang ở bậc nào trên thang (chọn lọc dữ liệu, gán ý nghĩa, giả định), chúng ta có thể quay lại bước dữ liệu khách quan để kiểm chứng lại mô hình tâm trí của mình."
      },
      {
        q: "Làm thế nào để thực hiện thay đổi hệ thống một cách bền vững?",
        opts: ["Dùng quyền lực ép buộc", "Tập trung vào việc thay đổi cấu trúc và các vòng lặp phản hồi đồng thời với việc chuyển đổi mô hình tâm trí của các tác nhân", "Thay đổi tất cả mọi thứ cùng một lúc", "Chỉ cần thay đổi người đứng đầu"],
        c: 1,
        e: "Thay đổi bền vững đòi hỏi sự đồng bộ giữa 'phần cứng' (cấu trúc, quy trình) và 'phần mềm' (tâm trí, mục tiêu). Thiếu một trong hai, hệ thống sẽ tự điều chỉnh về trạng thái cũ."
      }
    ]
  },
  4: {
    title: "QUIZ GIAI ĐOẠN 4",
    subtitle: "Thiết Kế Hệ Thống & Dự Phòng — Cần 4/5 để pass",
    questions: [
      {
        q: "Tính 'Tự phục hồi' (Resilience) của hệ thống khác với tính 'Ổn định' (Stability) như thế nào?",
        opts: ["Resilience là không bao giờ biến động", "Stability là quay lại trạng thái cũ nhanh, Resilience là khả năng duy trì chức năng cốt lõi ngay cả khi bị xáo trộn mạnh", "Resilience chỉ dành cho sinh học", "Chúng là một"],
        c: 1,
        e: "Một hệ thống ổn định có thể rất giòn (fragile) và sụp đổ nếu gặp cú sốc quá lớn. Một hệ thống resilience có thể biến động mạnh nhưng không bị phá hủy hoàn toàn."
      },
      {
        q: "Tại sao 'Tối ưu hóa cục bộ' (Sub-optimization) lại nguy hiểm?",
        opts: ["Vì nó làm tốn kém chi phí", "Vì việc làm tốt nhất một bộ phận có thể gây hại cho hiệu quả tổng thể của cả hệ thống", "Vì nó quá khó để thực hiện", "Vì nó làm nhân viên lười biếng"],
        c: 1,
        e: "Nếu bộ phận kho hàng tối ưu bằng cách nhập thật nhiều để giảm giá mua, nó sẽ gây áp lực dòng tiền lên bộ phận tài chính và gây tắc nghẽn cho bộ phận vận hành. Hệ thống cần tối ưu tổng thể."
      },
      {
        q: "Vai trò của 'Bộ đệm' (Buffer) trong thiết kế hệ thống là gì?",
        opts: ["Làm hệ thống chạy chậm lại một cách vô ích", "Giảm tác động của các biến động bất ngờ và tạo thời gian cho các vòng lặp phản hồi hoạt động", "Để lãng phí tài nguyên", "Để che giấu các lỗi sai"],
        c: 1,
        e: "Bộ đệm (như hàng tồn kho, quỹ dự phòng, thời gian chờ) cung cấp sự linh hoạt. Nếu hệ thống quá 'tinh gọn' (lean) mà không có đệm, nó sẽ cực kỳ dễ tổn thương trước các cú sốc."
      },
      {
        q: "Nguyên tắc 'Modularization' (Mô-đun hóa) giúp ích gì cho hệ thống phức tạp?",
        opts: ["Làm hệ thống trông đẹp hơn", "Ngăn chặn sự sụp đổ dây chuyền (cascading failure) bằng cách cô lập các thành phần", "Làm hệ thống rẻ hơn", "Giúp mọi người làm việc độc lập hoàn toàn"],
        c: 1,
        e: "Khi các phần được thiết kế theo mô-đun, một phần bị hỏng sẽ không kéo theo toàn bộ hệ thống sụp đổ. Đây là cách các hệ thống lớn (như internet hay lưới điện) duy trì sự tồn tại."
      },
      {
        q: "Trong thiết kế hệ thống, 'Loose Coupling' (Liên kết lỏng) có ưu điểm gì?",
        opts: ["Làm các bộ phận không liên quan đến nhau", "Giúp hệ thống linh hoạt hơn và ít bị ảnh hưởng bởi những sai sót nhỏ từ một phía", "Làm hệ thống mất đoàn kết", "Dễ quản lý hơn vì không cần giao tiếp"],
        c: 1,
        e: "Liên kết lỏng cho phép các thành phần của hệ thống có không gian tự điều chỉnh mà không gây áp lực ngay lập tức lên các thành phần khác, tăng tính thích nghi."
      }
    ]
  },
  5: {
    title: "QUIZ TỔNG HỢP",
    subtitle: "Tư Duy Hệ Thống Thực Chiến — Cần 4/5 để pass",
    questions: [
      {
        q: "Bước đầu tiên quan trọng nhất khi tiếp cận một vấn đề phức tạp theo tư duy hệ thống là:",
        opts: ["Đưa ra giải pháp ngay lập tức", "Xác định ranh giới hệ thống (Boundaries) và các tác nhân chính cùng mối quan hệ của chúng", "Tìm người để đổ lỗi", "Thu thập tất cả dữ liệu có thể"],
        c: 1,
        e: "Nếu không xác định ranh giới và mối quan hệ, bạn sẽ giải quyết sai vấn đề hoặc tạo ra hệ quả phụ ở một nơi khác mà bạn không quan sát tới."
      },
      {
        q: "Tại sao giải pháp 'Common Sense' (thông thường) hay phản tác dụng trong hệ thống phức tạp?",
        opts: ["Vì mọi người không có common sense", "Vì hệ thống phức tạp thường có tính phản trực giác (counter-intuitive)", "Vì common sense luôn luôn sai", "Vì nó quá dễ để nghĩ ra"],
        c: 1,
        e: "Trong hệ thống, nguyên nhân và kết quả thường tách rời nhau về không gian và thời gian. Giải pháp trực giác (như xây thêm đường để giảm tắc đường) thường chỉ làm vấn đề tệ hơn trong dài hạn."
      },
      {
        q: "Làm thế nào để duy trì tư duy hệ thống trong một môi trường áp lực cao?",
        opts: ["Luôn luôn chạy nhanh hơn", "Dành thời gian để 'Zoom out' quan sát tảng băng và các vòng lặp thay vì chỉ phản ứng với các sự kiện hàng ngày", "Bỏ qua các chi tiết nhỏ", "Làm việc một mình"],
        c: 1,
        e: "Tư duy hệ thống yêu cầu sự tĩnh lặng để quan sát mẫu hình. Trong áp lực, chúng ta dễ rơi lại vào tư duy tuyến tính triệu chứng. Kỹ năng quan trọng nhất là biết dừng lại để nhìn bức tranh lớn."
      },
      {
        q: "Một 'Người hành động hệ thống' (Systems Practitioner) thành công là người:",
        opts: ["Biết tất cả các câu trả lời", "Luôn tìm cách can thiệp ít nhất nhưng tạo ra thay đổi lớn nhất thông qua các điểm đòn bẩy", "Làm việc chăm chỉ nhất", "Kiểm soát tất cả mọi người"],
        c: 1,
        e: "Hệ thống không thể bị kiểm soát, chỉ có thể được thấu hiểu và điều hướng. Người Practitioner giỏi là người biết 'khiêu vũ' cùng hệ thống thay vì cố ép buộc nó."
      },
      {
        q: "Tư duy hệ thống đóng góp gì lớn nhất cho sự phát triển cá nhân?",
        opts: ["Giúp bạn thông minh hơn mọi người", "Giúp bạn nhìn thấy sự kết nối, chịu trách nhiệm cho các vòng lặp mà mình tham gia và kiên nhẫn với các tiến trình có độ trễ", "Giúp bạn thăng tiến nhanh nhất", "Giúp bạn không bao giờ mắc sai lầm"],
        c: 1,
        e: "Nó thay đổi thế giới quan của bạn: từ nhìn sự vật rời rạc sang nhìn mối liên hệ, từ đổ lỗi cho bên ngoài sang hiểu cấu trúc mà mình là một phần trong đó. Đó là nền tảng cho sự trưởng thành bền vững."
      }
    ]
  }
};

let currentPhase = null, currentQ = 0, answers = [], answered = false;
let passed = JSON.parse(localStorage.getItem('systema_passed') || '[]');

function togglePhase(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}

function updateProgress() {
  for (let i = 1; i <= 5; i++) {
    const pp = document.getElementById('pp-' + i);
    const ph = document.getElementById('phase-' + i);
    if (passed.includes(i)) {
      if (pp) pp.classList.add('done');
      if (ph) { ph.classList.add('completed'); ph.classList.remove('active'); }
    }
  }
  const p = Math.round((passed.length / 5) * 100);
  const fill = document.getElementById('overall-fill');
  const lbl = document.getElementById('overall-label');
  if (fill) fill.style.width = p + '%';
  if (lbl) lbl.textContent = passed.length + ' / 5 giai đoạn hoàn thành — ' + p + '% tiến trình';
}

function resetProgress() {
  if (!confirm('Xóa toàn bộ tiến trình Giai đoạn 1-5?')) return;
  localStorage.removeItem('systema_passed');
  passed = [];
  location.reload();
}

function openQuiz(p) {
  currentPhase = p; currentQ = 0; answered = false;
  answers = new Array(quizData[p].questions.length).fill(null);
  document.getElementById('modal-title').textContent = quizData[p].title;
  document.getElementById('modal-sub').textContent = quizData[p].subtitle;
  renderQuestion();
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuiz() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderQuestion() {
  const data = quizData[currentPhase];
  const q = data.questions[currentQ];
  const total = data.questions.length;
  const progress = Math.round((currentQ / total) * 100);

  let html = `
    <div class="q-progress-bar"><div class="q-progress-fill" style="width:${progress}%"></div></div>
    <div class="q-meta">CÂU HỎI ${currentQ + 1} / ${total}</div>
    <div class="q-text">${q.q}</div>
    <div class="q-options">
  `;

  q.opts.forEach((opt, idx) => {
    const isSelected = answers[currentQ] === idx;
    html += `
      <div class="q-opt ${isSelected ? 'selected' : ''}" onclick="selectOption(${idx})">
        <span class="q-opt-letter">${String.fromCharCode(65 + idx)}</span>
        <span class="q-opt-text">${opt}</span>
      </div>
    `;
  });

  html += `</div>
    <div class="q-explanation" id="explanation">${q.e}</div>
    <div class="q-footer">
      <div class="q-status" id="q-status">${answers[currentQ] !== null ? '✓ Đã chọn' : 'Vui lòng chọn một đáp án'}</div>
      <button class="btn-next" id="btn-next" onclick="handleNext()" ${answers[currentQ] === null ? 'disabled' : ''}>
        ${currentQ === total - 1 ? 'XEM KẾT QUẢ' : 'TIẾP THEO →'}
      </button>
    </div>
  `;

  document.getElementById('modal-body').innerHTML = html;
}

function selectOption(idx) {
  if (answered) return;
  answers[currentQ] = idx;
  answered = true;

  const q = quizData[currentPhase].questions[currentQ];
  const opts = document.querySelectorAll('.q-opt');
  
  opts.forEach((opt, i) => {
    if (i === q.c) opt.classList.add('correct');
    else if (i === idx) opt.classList.add('wrong');
    opt.style.pointerEvents = 'none';
  });

  document.getElementById('explanation').style.display = 'block';
  document.getElementById('btn-next').disabled = false;
  document.getElementById('q-status').innerHTML = idx === q.c 
    ? '<span style="color:var(--green)">● CHÍNH XÁC</span>' 
    : '<span style="color:var(--red)">● CHƯA ĐÚNG</span>';
}

function handleNext() {
  if (currentQ < quizData[currentPhase].questions.length - 1) {
    currentQ++;
    answered = false;
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const data = quizData[currentPhase];
  let correctCount = 0;
  answers.forEach((ans, idx) => {
    if (ans === data.questions[idx].c) correctCount++;
  });

  const isPassed = correctCount >= 4;
  if (isPassed && !passed.includes(currentPhase)) {
    passed.push(currentPhase);
    localStorage.setItem('systema_passed', JSON.stringify(passed));
    
    // Sync with Nexus Profile
    const activeUser = localStorage.getItem('nexus_active_profile');
    if (activeUser) {
        let userData = JSON.parse(localStorage.getItem('nexus_data_' + activeUser) || '{}');
        if (!userData.systema) userData.systema = {};
        if (!userData.systema.phasesPassed) userData.systema.phasesPassed = [];
        if (!userData.systema.phasesPassed.includes(currentPhase)) {
            userData.systema.phasesPassed.push(currentPhase);
            localStorage.setItem('nexus_data_' + activeUser, JSON.stringify(userData));
        }
    }
    updateProgress();
  }

  const resultTitle = isPassed ? 'CHÚC MỪNG!' : 'CHƯA ĐẠT';
  const resultClass = isPassed ? 'pass' : 'fail';
  const resultMsg = isPassed 
    ? `Bạn đã xuất sắc vượt qua bài kiểm tra Giai đoạn ${currentPhase} với số điểm ${correctCount}/5. Tiếp tục giữ vững phong độ!`
    : `Bạn đạt ${correctCount}/5 câu đúng. Hệ thống yêu cầu tối thiểu 4/5 để vượt qua. Hãy dành thời gian ôn lại kỹ hơn kiến thức của giai đoạn này.`;

  document.getElementById('modal-body').innerHTML = `
    <div class="result-container">
      <div class="result-score ${resultClass}">${correctCount}/5</div>
      <div class="result-title ${resultClass}">${resultTitle}</div>
      <div class="result-msg">${resultMsg}</div>
      <div class="result-actions">
        ${!isPassed ? `<button class="btn-retry" onclick="openQuiz(${currentPhase})">THỬ LẠI</button>` : ''}
        <button class="btn-close-modal" onclick="closeQuiz()">ĐÓNG</button>
      </div>
    </div>
  `;
}

// DOCS DRAWER
function openDocs() {
  document.body.classList.add('docs-open');
  document.getElementById('docs-overlay').style.display = 'block';
  setTimeout(() => {
    document.getElementById('docs-drawer').classList.add('open');
    checkDocsLock();
  }, 10);
}

function closeDocs() {
  document.body.classList.remove('docs-open');
  document.getElementById('docs-drawer').classList.remove('open');
  setTimeout(() => {
    document.getElementById('docs-overlay').style.display = 'none';
  }, 400);
}

function showDocSection(id, btn) {
  document.querySelectorAll('.docs-section').forEach(s => s.classList.remove('active'));
  document.getElementById('doc-' + id).classList.add('active');
  document.querySelectorAll('.docs-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

function checkDocsLock() {
  const activeUser = localStorage.getItem('nexus_active_profile');
  let passedPhases = [];
  if (activeUser) {
    const userData = JSON.parse(localStorage.getItem('nexus_data_' + activeUser) || '{}');
    passedPhases = userData.systema?.phasesPassed || [];
  } else {
    passedPhases = JSON.parse(localStorage.getItem('systema_passed') || '[]');
  }
  
  if (document.getElementById('lock-scan')) document.getElementById('lock-scan').style.display = passedPhases.includes(1) ? 'none' : 'flex';
  if (document.getElementById('lock-act')) document.getElementById('lock-act').style.display = passedPhases.includes(3) ? 'none' : 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  updateProgress();
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) closeQuiz();
    });
  }
});
