/**
 * ARGOS - Pitching & Critical Thinking Logic
 */

const QD = {
  1: {
    title: "QUIZ GIAI ĐOẠN 1",
    sub: "Tâm Lý Học Thuyết Phục & Sự Thật — Cần 4/5 để pass",
    qs: [
      {
        q: "Tại sao việc 'Nói sự thật' thường không đủ để thuyết phục người khác?",
        opts: ["Vì con người không thích sự thật", "Vì sự thật cần được đặt vào một khung tham chiếu (frame) mà người nghe có thể chấp nhận và cảm thấy liên quan", "Vì sự thật luôn luôn nhàm chán", "Vì nói dối hiệu quả hơn"],
        c: 1,
        e: "Sự thật khách quan thường khô khan. Để thuyết phục, bạn cần kết nối sự thật đó với giá trị, niềm tin hoặc nỗi đau của người nghe. Đó là nghệ thuật 'Framing'."
      },
      {
        q: "Hiệu ứng 'Backfire Effect' xảy ra khi nào?",
        opts: ["Khi bạn đưa ra quá nhiều bằng chứng khiến đối phương càng tin chặt hơn vào quan niệm sai lầm cũ của họ", "Khi đối phương lập tức đồng ý với bạn", "Khi bạn quên mất luận điểm chính", "Khi cuộc tranh luận kết thúc trong hòa bình"],
        c: 0,
        e: "Khi niềm tin cốt lõi bị đe dọa, việc đưa ra bằng chứng phản bác trực diện thường làm đối phương tự vệ mạnh mẽ hơn. Thuyết phục cần sự tinh tế, không phải là một cuộc tấn công bằng dữ liệu."
      },
      {
        q: "Yếu tố nào quan trọng nhất trong 'Ethos' (Uy tín) của người nói?",
        opts: ["Bộ quần áo họ đang mặc", "Sự kết hợp giữa chuyên môn (competence) và sự chính trực (character/goodwill) được người nghe cảm nhận", "Độ lớn của giọng nói", "Số lượng slide trong bản thuyết trình"],
        c: 1,
        e: "Ethos không chỉ là bằng cấp, mà là việc người nghe tin rằng bạn đủ giỏi để biết mình đang nói gì và đủ tử tế để không lừa dối họ."
      },
      {
        q: "Trong thuyết phục, 'Liking' (Sự yêu thích) hoạt động dựa trên:",
        opts: ["Việc tặng quà cho đối phương", "Sự tương đồng, lời khen ngợi chân thành và mục tiêu chung", "Việc luôn luôn đồng ý với đối phương", "Vẻ ngoài hấp dẫn"],
        c: 1,
        e: "Chúng ta dễ bị thuyết phục bởi những người mà chúng ta thấy giống mình hoặc những người cho chúng ta thấy họ đứng về phía mình."
      },
      {
        q: "Nguyên tắc 'Social Proof' (Bằng chứng xã hội) có sức mạnh lớn nhất khi nào?",
        opts: ["Khi thông tin đến từ một người lạ", "Khi chúng ta ở trong tình trạng không chắc chắn và nhìn thấy những người 'giống mình' đang hành động", "Khi có quá nhiều người cùng làm một việc", "Khi chính phủ yêu cầu"],
        c: 1,
        e: "Khi không biết phải làm gì, chúng ta có xu hướng nhìn quanh. Nếu thấy những người có hoàn cảnh tương tự đang chọn phương án A, chúng ta sẽ tin rằng A là đúng."
      }
    ]
  },
  2: {
    title: "QUIZ GIAI ĐOẠN 2",
    sub: "Cấu Trúc Lập Luận & Ngụy Biện — Cần 4/5 để pass",
    qs: [
      {
        q: "Ngụy biện 'Ad Hominem' là gì?",
        opts: ["Tấn công vào lập luận của đối phương", "Tấn công vào cá nhân người nói thay vì tranh luận về vấn đề đang thảo luận", "Lấy thiểu số đại diện cho đa số", "Sử dụng cảm xúc để lấn át lý trí"],
        c: 1,
        e: "Đây là lỗi phổ biến nhất. Thay vì nói tại sao ý tưởng đó sai, người ta lại nói tại sao người đưa ra ý tưởng đó không đáng tin vì đời tư hoặc tính cách của họ."
      },
      {
        q: "Cấu trúc lập luận 'PREP' bao gồm những gì?",
        opts: ["Point - Reason - Example - Point", "Problem - Reason - Example - Point", "Point - Review - Evidence - Point", "Point - Reason - Evidence - Practice"],
        c: 0,
        e: "PREP giúp bạn trình bày ý kiến một cách cực kỳ mạch lạc: Đưa ra quan điểm -> Giải thích lý do -> Đưa ra ví dụ/bằng chứng -> Chốt lại quan điểm."
      },
      {
        q: "Ngụy biện 'Strawman' (Người rơm) hoạt động như thế nào?",
        opts: ["Đốt cháy lập luận của đối phương", "Bóp méo lập luận của đối phương thành một phiên bản cực đoan hoặc sai lệch để dễ dàng tấn công", "Im lặng khi bị chất vấn", "Lôi kéo đám đông ủng hộ mình"],
        c: 1,
        e: "Thay vì tranh luận với con người thật, bạn dựng lên một 'hình nhân' dễ đánh bại hơn bằng cách xuyên tạc lời nói của họ."
      },
      {
        q: "Sự khác biệt giữa 'Argument' (Lập luận) và 'Assertion' (Khẳng định) là gì?",
        opts: ["Không có sự khác biệt", "Assertion là một tuyên bố không có bằng chứng, Argument là tuyên bố đi kèm với lý lẽ và bằng chứng hỗ trợ", "Argument luôn gay gắt hơn Assertion", "Assertion luôn đúng hơn"],
        c: 1,
        e: "Nhiều người tưởng mình đang tranh luận nhưng thực ra họ chỉ đang lặp đi lặp lại những lời khẳng định không có căn cứ. Một lập luận mạnh cần có cái 'Tại sao'."
      },
      {
        q: "Ngụy biện 'Slippery Slope' (Dốc đứng trơn trượt) cảnh báo điều gì?",
        opts: ["Cẩn thận khi đi đường dốc", "Việc khẳng định rằng một hành động nhỏ sẽ dẫn đến một chuỗi hệ quả khủng khiếp mà không có bằng chứng về mối liên kết đó", "Sự thay đổi luôn dẫn đến thất bại", "Hệ quả luôn luôn xấu"],
        c: 1,
        e: "Kiểu lập luận: 'Nếu chúng ta cho phép A, thì B sẽ xảy ra, rồi C, và cuối cùng là tận thế', trong khi thực tế A không nhất thiết dẫn đến B."
      }
    ]
  },
  3: {
    title: "QUIZ GIAI ĐOẠN 3",
    sub: "Nghệ Thuật Đặt Câu Hỏi & Lắng Nghe — Cần 4/5 để pass",
    qs: [
      {
        q: "Tại sao 'Câu hỏi mở' lại quan trọng hơn 'Câu hỏi đóng' trong thương lượng?",
        opts: ["Vì nó làm cuộc trò chuyện kéo dài", "Vì nó buộc đối phương phải cung cấp thông tin, bộc lộ nhu cầu và cảm xúc thật", "Vì nó dễ đặt hơn", "Vì nó thể hiện quyền lực"],
        c: 1,
        e: "Câu hỏi đóng (Có/Không) thường kết thúc luồng thông tin. Câu hỏi mở (Cái gì/Như thế nào) mở ra thế giới quan của đối phương."
      },
      {
        q: "Kỹ thuật 'Labeling' (Dán nhãn cảm xúc) của Chris Voss hoạt động thế nào?",
        opts: ["Để mắng mỏ đối phương", "Để nhận diện và gọi tên cảm xúc của đối phương (Vd: 'Có vẻ như bạn đang cảm thấy...') giúp xoa dịu sự tự vệ", "Để phân loại khách hàng", "Để ép đối phương đồng ý"],
        c: 1,
        e: "Khi bạn gọi tên nỗi sợ hoặc sự thất vọng của đối phương một cách điềm tĩnh, amygdala (phần não sợ hãi) của họ sẽ giảm hoạt động, giúp họ bình tĩnh hơn."
      },
      {
        q: "Lắng nghe chủ động (Active Listening) yêu cầu bạn phải:",
        opts: ["Giữ im lặng hoàn toàn", "Phản hồi lại những gì bạn nghe được bằng cách tóm tắt và xác nhận lại ý của đối phương", "Nghĩ về câu trả lời tiếp theo khi họ đang nói", "Ghi chép mọi từ họ nói"],
        c: 1,
        e: "Lắng nghe không phải là chờ đến lượt mình nói. Đó là việc chứng minh cho đối phương thấy bạn thực sự hiểu những gì họ đang truyền đạt."
      },
      {
        q: "Câu hỏi 'Tại sao' (Why) nên được sử dụng cẩn thận vì:",
        opts: ["Nó quá ngắn", "Nó thường tạo cảm giác bị buộc tội hoặc thẩm vấn, khiến đối phương phải bào chữa thay vì chia sẻ", "Nó không có tác dụng gì", "Nó khó trả lời"],
        c: 1,
        e: "Thay vì 'Tại sao bạn làm vậy?', hãy thử 'Điều gì dẫn bạn đến quyết định đó?'. Hiệu quả sẽ khác biệt hoàn toàn."
      },
      {
        q: "Sự im lặng trong tranh luận có tác dụng gì?",
        opts: ["Thể hiện sự bế tắc", "Tạo áp lực buộc đối phương phải nói thêm để lấp đầy khoảng trống, thường bộc lộ thêm thông tin quan trọng", "Làm lãng phí thời gian", "Thể hiện sự coi thường"],
        c: 1,
        e: "Người không chịu được im lặng thường là người yếu thế hơn trong cuộc đàm phán. Im lặng là một công cụ tạo ảnh hưởng cực kỳ mạnh mẽ."
      }
    ]
  },
  4: {
    title: "QUIZ GIAI ĐOẠN 4",
    sub: "Kỹ Thuật Pitching & Storytelling — Cần 4/5 để pass",
    qs: [
      {
        q: "Một bản Pitch thành công phải tập trung vào:",
        opts: ["Tính năng của sản phẩm/ý tưởng", "Lợi ích và giá trị mà ý tưởng đó mang lại cho người nghe", "Lịch sử của công ty", "Độ giỏi của người trình bày"],
        c: 1,
        e: "Người nghe luôn tự hỏi: 'Điều này có lợi gì cho tôi?'. Nếu bạn không trả lời được câu đó ngay lập tức, bạn đã thua."
      },
      {
        q: "Tại sao Storytelling lại hiệu quả hơn việc liệt kê số liệu?",
        opts: ["Vì con người thích giải trí", "Vì câu chuyện kích hoạt nhiều vùng não, tạo ra sự kết nối cảm xúc và giúp ghi nhớ thông tin lâu hơn", "Vì kể chuyện dễ hơn phân tích số", "Vì số liệu luôn luôn sai"],
        c: 1,
        e: "Số liệu tác động vào lý trí, nhưng câu chuyện tác động vào trái tim. Con người ra quyết định bằng cảm xúc và biện minh bằng lý trí."
      },
      {
        q: "Trong cấu trúc 'Hero's Journey', ai nên là người anh hùng?",
        opts: ["Chính bạn (người Pitch)", "Khách hàng/Người nghe của bạn", "Sản phẩm của bạn", "Đối thủ cạnh tranh"],
        c: 1,
        e: "Đừng đóng vai anh hùng. Hãy đóng vai người dẫn đường (Guide) giúp khách hàng của bạn trở thành anh hùng trong câu chuyện của chính họ."
      },
      {
        q: "Kỹ thuật 'The Hook' trong 30 giây đầu tiên có mục đích:",
        opts: ["Để giới thiệu tên tuổi", "Để thu hút sự chú ý ngay lập tức và khiến người nghe muốn biết thêm", "Để khoe khoang thành tích", "Để kết thúc bài Pitch nhanh"],
        c: 1,
        e: "Nếu bạn không 'móc' được họ trong 30 giây đầu, tâm trí họ sẽ rời khỏi căn phòng ngay lập tức."
      },
      {
        q: "Tại sao bạn cần chuẩn bị cho phần Q&A kỹ hơn cả phần Pitch?",
        opts: ["Vì Q&A thường dài hơn", "Vì đây là lúc uy tín của bạn được thử thách thực sự qua khả năng ứng biến và độ sâu của kiến thức", "Vì người nghe thích hỏi khó", "Vì không có slide hỗ trợ"],
        c: 1,
        e: "Một bài Pitch hay có thể được tập dượt, nhưng câu trả lời Q&A hay chứng minh bạn thực sự làm chủ vấn đề."
      }
    ]
  },
  5: {
    title: "QUIZ TỔNG HỢP",
    sub: "Bậc Thầy Thuyết Phục & Phản Biện — Cần 4/5 để pass",
    qs: [
      {
        q: "Mục tiêu cuối cùng của ARGOS là gì?",
        opts: ["Chiến thắng trong mọi cuộc tranh luận", "Đạt được sự đồng thuận và tạo ra thay đổi tích cực thông qua lập luận sắc bén và sự thấu cảm", "Làm đối phương cảm thấy thua kém", "Trở thành người nói giỏi nhất"],
        c: 1,
        e: "Thuyết phục không phải là đánh bại. Đó là việc mời gọi người khác đi cùng con đường với mình một cách tự nguyện."
      },
      {
        q: "Làm thế nào để giữ bình tĩnh khi bị tấn công cá nhân?",
        opts: ["Tấn công lại mạnh hơn", "Nhận diện ngụy biện, hít thở sâu và kéo cuộc hội thoại quay lại dữ liệu và lập luận khách quan", "Bỏ đi ngay lập tức", "Khóc để lấy sự thương hại"],
        c: 1,
        e: "Khi bạn mất bình tĩnh, bạn mất quyền kiểm soát cuộc hội thoại. Hãy coi đòn tấn công cá nhân là dấu hiệu đối phương đã hết lý lẽ."
      },
      {
        q: "Khi nào bạn nên thừa nhận mình sai trong một cuộc tranh luận?",
        opts: ["Không bao giờ", "Ngay khi nhận ra bằng chứng và lập luận của đối phương là đúng đắn và vững chắc hơn", "Khi bị nhiều người phản đối", "Khi cảm thấy mệt mỏi"],
        c: 1,
        e: "Thừa nhận cái sai đúng lúc không làm giảm uy tín, trái lại nó nâng cao Ethos của bạn vì sự chính trực và cầu thị."
      },
      {
        q: "Điểm khác biệt giữa Thuyết phục (Persuasion) và Thao túng (Manipulation) là gì?",
        opts: ["Không có sự khác biệt", "Thuyết phục dựa trên lợi ích chung và sự thật; Thao túng dựa trên sự lừa dối và chỉ vì lợi ích của người nói", "Thao túng hiệu quả hơn", "Thuyết phục chậm hơn"],
        c: 1,
        e: "Manipulation có thể thắng ngắn hạn nhưng sẽ hủy diệt Ethos dài hạn. Persuasion xây dựng mối quan hệ bền vững."
      },
      {
        q: "Kỹ năng phản biện quan trọng nhất mà bạn rút ra được là:",
        opts: ["Khả năng phát hiện lỗi của người khác", "Khả năng tự phản biện (Self-reflection) và kiểm tra lại các mô hình tư duy của chính mình", "Khả năng nói nhanh", "Khả năng trích dẫn nhiều nguồn"],
        c: 1,
        e: "Phản biện người khác là dễ, phản biện chính mình mới là khó. Đó là con đường duy nhất để đạt đến sự thông thái."
      }
    ]
  }
};

let curPh=null, curQ=0, answers=[], answered=false;
let passed = JSON.parse(localStorage.getItem('argos_passed') || '[]');

function togglePh(id) {
  document.getElementById(id).classList.toggle('open');
}

function updateProg() {
  for (let i = 1; i <= 5; i++) {
    const ps = document.getElementById('ps-' + i);
    const ph = document.getElementById('ph-' + i);
    if (passed.includes(i)) {
      if (ps) ps.classList.add('done');
      if (ph) { ph.classList.add('completed'); ph.classList.remove('active'); }
    }
  }
  const p = Math.round((passed.length / 5) * 100);
  const fill = document.getElementById('prog-fill');
  const lbl = document.getElementById('prog-label');
  if (fill) fill.style.width = p + '%';
  if (lbl) lbl.textContent = passed.length + ' / 5 giai đoạn — ' + p + '% hoàn thành';
}

function resetProg() {
  if (!confirm('Xóa toàn bộ tiến trình Giai đoạn 1-5?')) return;
  localStorage.removeItem('argos_passed');
  passed = [];
  location.reload();
}

function openQ(p) {
  curPh = p; curQ = 0; answered = false;
  answers = new Array(QD[p].qs.length).fill(null);
  document.getElementById('q-title').textContent = QD[p].title;
  document.getElementById('q-sub').textContent = QD[p].sub;
  renderQ();
  document.getElementById('q-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQ() {
  document.getElementById('q-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderQ() {
  const d = QD[curPh], q = d.qs[curQ], tot = d.qs.length;
  const pct = Math.round((curQ / tot) * 100);
  let html = `
    <div class="q-progress-bar"><div class="q-progress-fill" style="width:${pct}%"></div></div>
    <div class="q-meta">CÂU HỎI ${curQ + 1} / ${tot}</div>
    <div class="q-text">${q.q}</div>
    <div class="q-options">
  `;
  q.opts.forEach((o, i) => {
    const sel = answers[curQ] === i;
    html += `
      <div class="q-opt ${sel ? 'selected' : ''}" onclick="pick(${i})">
        <span class="q-opt-ltr">${String.fromCharCode(65 + i)}</span>
        <span class="q-opt-txt">${o}</span>
      </div>
    `;
  });
  html += `</div>
    <div class="q-exp" id="q-exp">${q.e}</div>
    <div class="q-footer">
      <div class="q-status" id="q-status">${answers[curQ] !== null ? '✓ Đã chọn' : 'Vui lòng chọn đáp án'}</div>
      <button class="btn-nxt" id="btn-nxt" onclick="nxt()" ${answers[curQ] === null ? 'disabled' : ''}>
        ${curQ === tot - 1 ? 'KẾT QUẢ' : 'TIẾP THEO'}
      </button>
    </div>
  `;
  document.getElementById('q-body').innerHTML = html;
}

function pick(i) {
  if (answered) return;
  answers[curQ] = i; answered = true;
  const q = QD[curPh].qs[curQ];
  document.querySelectorAll('.q-opt').forEach((el, idx) => {
    if (idx === q.c) el.classList.add('correct');
    else if (idx === i) el.classList.add('wrong');
    el.style.pointerEvents = 'none';
  });
  document.getElementById('q-exp').style.display = 'block';
  document.getElementById('btn-nxt').disabled = false;
  document.getElementById('q-status').innerHTML = i === q.c ? '✓ CHÍNH XÁC' : '✗ CHƯA ĐÚNG';
}

function nxt() {
  if (curQ < QD[curPh].qs.length - 1) { curQ++; answered = false; renderQ(); }
  else { showRes(); }
}

function showRes() {
  const d = QD[curPh]; let c = 0;
  answers.forEach((a, i) => { if (a === d.qs[i].c) c++; });
  const ok = c >= 4;
  if (ok && !passed.includes(curPh)) {
    passed.push(curPh);
    localStorage.setItem('argos_passed', JSON.stringify(passed));
    
    // Sync with Nexus Profile
    const activeUser = localStorage.getItem('nexus_active_profile');
    if (activeUser) {
        let userData = JSON.parse(localStorage.getItem('nexus_data_' + activeUser) || '{}');
        if (!userData.argos) userData.argos = {};
        if (!userData.argos.phasesPassed) userData.argos.phasesPassed = [];
        if (!userData.argos.phasesPassed.includes(curPh)) {
            userData.argos.phasesPassed.push(curPh);
            localStorage.setItem('nexus_data_' + activeUser, JSON.stringify(userData));
        }
    }
    updateProg();
  }
  document.getElementById('q-body').innerHTML = `
    <div class="res-wrap">
      <div class="res-score ${ok ? 'pass' : 'fail'}">${c}/5</div>
      <div class="res-msg">${ok ? 'CHÚC MỪNG! BẠN ĐÃ PASS.' : 'CHƯA ĐẠT. VUI LÒNG ÔN TẬP LẠI.'}</div>
      <div class="res-actions">
        ${!ok ? `<button onclick="openQ(${curPh})">THỬ LẠI</button>` : ''}
        <button onclick="closeQ()">ĐÓNG</button>
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
    passedPhases = userData.argos?.phasesPassed || [];
  } else {
    passedPhases = JSON.parse(localStorage.getItem('argos_passed') || '[]');
  }
  if (document.getElementById('lock-scan')) document.getElementById('lock-scan').style.display = passedPhases.includes(1) ? 'none' : 'flex';
  if (document.getElementById('lock-act')) document.getElementById('lock-act').style.display = passedPhases.includes(3) ? 'none' : 'flex';
}

document.addEventListener('DOMContentLoaded', updateProg);
