/**
 * COGNOS - AI Governance Training Logic
 */

const QUIZZES = {
  1:{
    title:"QUIZ GIAI ĐOẠN 1",
    sub:"Bản Chất AI — 5 câu · cần 4/5",
    qs:[
      {
        q:"LLM (Large Language Model) thực chất làm gì khi 'trả lời' câu hỏi của bạn?",
        opts:["Tra cứu dữ liệu từ internet theo thời gian thực","Suy luận logic từ kiến thức được lưu trữ như não người","Dự đoán chuỗi token tiếp theo có khả năng xuất hiện cao nhất dựa trên pattern trong training data","Kết hợp cả tra cứu và suy luận để tạo câu trả lời tối ưu"],
        c:2,
        e:"LLM là statistical pattern matcher, không phải reasoning engine hay search engine. Nó học 'text nào thường đi sau text nào' từ hàng tỷ ví dụ. Điều này giải thích tại sao nó tự tin ngay cả khi sai — nó đang tạo ra text 'nghe có vẻ đúng' chứ không phải text 'đã được verify là đúng'."
      },
      {
        q:"Tại sao AI 'hallucinate' (bịa thông tin trông có vẻ thật)?",
        opts:["Vì AI được lập trình để luôn cung cấp câu trả lời, ngay cả khi không có thông tin","Vì cơ chế tạo text ưu tiên coherence và plausibility hơn accuracy — text 'nghe có lý' và text 'đúng' là hai thứ khác nhau","Vì training data chứa nhiều thông tin sai","Vì AI cố ý lừa người dùng để trông thông minh hơn"],
        c:1,
        e:"Hallucination không phải là bug mà là consequence của cách LLM hoạt động. Nó tối ưu hóa để tạo ra text mạch lạc và plausible, không phải text chính xác. 'Nghe có lý' và 'thực sự đúng' thường overlap nhưng không phải lúc nào cũng vậy — và chính sự overlap đó là nguy hiểm vì làm ta khó phân biệt."
      },
      {
        q:"Điều nào sau đây là điểm mạnh THỰC SỰ của AI generative hiện tại?",
        opts:["Reasoning phức tạp với nhiều bước và điều kiện logic chặt chẽ","Xử lý và tổng hợp lượng lớn text, tạo ra bản nháp, paraphrase, và brainstorm nhanh","Cung cấp thông tin factual chính xác về sự kiện gần đây","Đưa ra phán xét đạo đức đúng trong các tình huống phức tạp"],
        c:1,
        e:"AI generative rất giỏi ở text processing tasks: summarize, draft, rephrase, generate options, explain concepts. Nó kém ở: multi-step logical reasoning, real-time factual accuracy, ethical judgment, tasks yêu cầu xác suất calibrated. Biết điểm mạnh thực sự giúp bạn dùng AI đúng chỗ."
      },
      {
        q:"Phân biệt AI 'biết' vs AI 'predict' quan trọng thế nào trong thực tế?",
        opts:["Không quan trọng — kết quả cuối cùng là như nhau dù AI biết hay predict","Rất quan trọng — nếu AI predict thay vì biết, bạn không thể tin vào output mà không verify","Chỉ quan trọng cho technical users, không cần thiết cho business users","Quan trọng nhưng chỉ với các task kỹ thuật cao như coding hay math"],
        c:1,
        e:"Đây là distinction cốt lõi. Người 'biết' 2+2=4 sẽ đúng 100% lần. AI 'predict' rằng '4' là token hợp lý sau '2+2=' — đúng gần 100% lần vì pattern này rất phổ biến. Nhưng với câu hỏi ít phổ biến hơn hoặc yêu cầu reasoning, xác suất đúng giảm đi và bạn không biết khi nào nó đang tụt. Đây là lý do verification quan trọng."
      },
      {
        q:"Khi nào thì 'AI Contract' cá nhân có giá trị nhất?",
        opts:["Khi bạn muốn share với người khác để họ biết bạn dùng AI có trách nhiệm","Khi bạn gặp edge case hoặc tình huống mà bạn bị tempted để dùng AI theo cách bạn biết là không nên","Chỉ có giá trị cho developers và policymakers","Chỉ cần thiết trong môi trường corporate, không cần cho cá nhân"],
        c:1,
        e:"AI Contract có giá trị nhất như một pre-commitment device — bạn viết ra nguyên tắc khi đầu óc clear, để tham chiếu khi đang trong moment of temptation (deadline gấp, quá tải, hoặc muốn shortcut). Như biết trước mình sẽ không ăn junk food sau 9pm — quyết định trước dễ hơn quyết định trong lúc đói."
      }
    ]
  },
  2:{
    title:"QUIZ GIAI ĐOẠN 2",
    sub:"Giới Hạn AI & Bẫy Tư Duy — 5 câu · cần 4/5",
    qs:[
      {
        q:"'Automation bias' trong bối cảnh AI là gì?",
        opts:["Xu hướng ghét automation vì sợ mất việc","Xu hướng tin tưởng quá mức vào output của hệ thống tự động, ngay cả khi nó sai hoặc mâu thuẫn với kiến thức của mình","Xu hướng dùng AI cho mọi task dù không cần thiết","Xu hướng đánh giá AI là thiên vị (biased) hơn mức thực tế"],
        c:1,
        e:"Automation bias là một trong những bẫy nguy hiểm nhất vì nó subtle. Khi một hệ thống 'có vẻ thông minh' đưa ra output, chúng ta giảm critical thinking. Trong hàng không, automation bias đã gây ra tai nạn khi phi công tin autopilot sai hơn cảm giác thực tế của mình. Với AI, nó biểu hiện khi ta chấp nhận answer mà không đặt câu hỏi."
      },
      {
        q:"'Skill atrophy risk' khi dùng AI quá nhiều là gì và ví dụ thực tế?",
        opts:["Nguy cơ AI trở nên quá giỏi và không cần con người","Nguy cơ các kỹ năng của bạn suy giảm vì bạn không còn practice chúng — ví dụ: viết kém đi vì AI luôn draft, tính toán kém đi vì luôn dùng calculator","Nguy cơ AI học sai từ data cũ của bạn","Nguy cơ team mất việc vì AI làm thay"],
        c:1,
        e:"Skill atrophy là hậu quả dài hạn hay bị bỏ qua. Ví dụ thực: Google Maps → nhiều người không còn biết navigate; Spellcheck → nhiều người spelling kém hơn. Với AI: nếu AI luôn viết emails thay bạn, khả năng articulate suy nghĩ bằng chữ của bạn giảm đi. Bạn cần quyết định consciously kỹ năng nào muốn giữ và kỹ năng nào có thể 'outsource'."
      },
      {
        q:"Phân biệt 'AI fluency' (nghe tự tin) vs 'AI accuracy' (thực sự đúng) thực hành thế nào?",
        opts:["Chỉ tin output AI khi nó dùng ngôn ngữ kỹ thuật và formal","Verify các facts cụ thể (số liệu, tên, ngày, citation) bằng nguồn độc lập — đặc biệt với output confident và detailed","Chỉ dùng AI cho tasks không quan trọng","Yêu cầu AI tự verify output của nó trước khi bạn dùng"],
        c:1,
        e:"Fluent text và accurate text trông giống nhau khi đọc lướt. Verification strategy: identify các 'load-bearing facts' trong output (số liệu, quotes, claims cụ thể) và verify chúng bằng nguồn primary. Paradox: AI confident-sounding output thường cần verify hơn, không kém hơn — vì confidence không correlate với accuracy trong AI."
      },
      {
        q:"'AI anthropomorphism' (gán đặc tính người cho AI) gây ra vấn đề gì trong thực tế?",
        opts:["Không gây vấn đề gì — chỉ là cách nói thông thường","Khiến người dùng có kỳ vọng sai (AI 'muốn' giúp, AI 'biết' mình sai, AI 'cảm thấy' tốt hơn khi được khen) → dẫn đến over-trust và không verify","Chỉ gây vấn đề với trẻ em, không ảnh hưởng người lớn","Làm AI work harder vì cảm thấy được tôn trọng"],
        c:1,
        e:"Khi ta nói 'AI nghĩ rằng...' hay 'AI biết cách...', ta đang tạo mental model sai. AI không 'biết', không 'nghĩ', không 'muốn'. Những metaphors này nguy hiểm vì chúng trigger social cognition của chúng ta — ta bắt đầu trust AI như trust người, ngại 'sửa lỗi' nó, hay tin rằng nó sẽ cố gắng hơn nếu prompt nicely. Dùng AI fluency ≠ sử dụng AI intelligently."
      },
      {
        q:"'AI skepticism' lành mạnh khác 'AI phobia' ở điểm nào?",
        opts:["AI skepticism = không dùng AI; AI phobia = sợ AI","AI skepticism = đánh giá output có phê phán và verify khi cần, vẫn dùng AI cho tasks phù hợp; AI phobia = từ chối dùng AI dù nó có thể giúp ích","Chúng là từ đồng nghĩa","AI skepticism là tốt, AI phobia cũng tốt — cả hai đều bảo vệ bạn"],
        c:1,
        e:"AI skepticism lành mạnh không phải là chống AI — nó là calibrated trust. Giống như skepticism khoa học không phủ nhận khoa học mà đòi hỏi evidence. Với AI: sử dụng cho những gì nó giỏi, verify khi stakes cao, nhận ra giới hạn. AI phobia — từ chối hoàn toàn — cũng là failure mode vì bạn mất đi lợi thế productivity thực sự."
      }
    ]
  },
  3:{
    title:"QUIZ GIAI ĐOẠN 3",
    sub:"Prompt Thinking & Workflow Design — 5 câu · cần 4/5",
    qs:[
      {
        q:"Tại sao 'Role' (vai trò) trong prompt quan trọng?",
        opts:["Vì AI chỉ hoạt động khi được assign vai trò","Vì chỉ định role giúp AI activate đúng patterns và register trong training data tương ứng với domain đó, tạo output phù hợp hơn về tone, depth, và vocabulary","Vì AI sẽ từ chối trả lời nếu không có role","Vì role giúp AI biết độ dài câu trả lời cần viết"],
        c:1,
        e:"'Act as a senior product manager' vs 'Act as a beginner' tạo ra kết quả hoàn toàn khác dù cùng câu hỏi. Role không phải magic — nó giúp AI pull từ đúng subset của training data. Tuy nhiên, role không đảm bảo accuracy — AI vẫn có thể confabulate ngay cả khi đóng vai expert. Role + specific context + verification là combo đúng."
      },
      {
        q:"'Prompt laziness' là gì và hậu quả thực tế?",
        opts:["Dùng prompt quá ngắn, vague, thiếu context → AI phải 'đoán' intent → output generic, off-target, hoặc phải iterate nhiều lần không hiệu quả","Dùng quá nhiều prompt cho một task đơn giản","Copy prompt từ internet mà không adapt","Dùng AI cho task có thể làm tay nhanh hơn"],
        c:0,
        e:"Prompt laziness là đầu vào kém tốn thời gian hơn đầu vào tốt. Ví dụ: 'Viết email cho khách hàng' → AI tạo generic template. 'Viết email cho khách hàng B2B trong ngành logistics, họ đang cân nhắc không gia hạn hợp đồng vì lo ngại về SLA, tone cần empathetic nhưng confident, không quá 150 chữ' → output cụ thể, usable. Đầu tư 2 phút vào prompt tiết kiệm 10 phút iteration."
      },
      {
        q:"Trong AI workflow design, 'human review checkpoint' quan trọng nhất ở đâu?",
        opts:["Ở đầu workflow, trước khi AI bắt đầu làm","Trước khi output của AI được dùng cho quyết định quan trọng hoặc đưa ra ngoài — đây là 'last line of defense' cho quality và accuracy","Ở cuối workflow sau khi đã dùng output","Không cần thiết nếu prompt đủ tốt"],
        c:1,
        e:"Human review checkpoint là nơi AI workflow meets accountability. Nếu AI output sai và đi thẳng vào production, email, hoặc quyết định mà không qua review — bạn chịu hậu quả. Checkpoint không cần phải review toàn bộ — nó cần check những 'load-bearing elements': facts cụ thể, logic chính, tone, và bất kỳ điều gì có thể gây hại nếu sai."
      },
      {
        q:"Phân loại task 'human only' — trường hợp nào điển hình nhất?",
        opts:["Task cần nhiều thời gian — con người vẫn nhanh hơn AI","Tasks đòi hỏi judgment đạo đức, liên quan đến relationships quan trọng, cần creativity thực sự gắn với identity của bạn, hoặc có hậu quả nghiêm trọng nếu sai","Chỉ những task yêu cầu physical presence","Tasks liên quan đến tiền và pháp lý"],
        c:1,
        e:"'Human only' không phải về kỹ thuật — AI về lý thuyết có thể làm hầu hết mọi thứ. Nó là về appropriateness và accountability. Ví dụ: Performance review cho nhân viên của bạn không nên AI-written dù bạn có thể edit — vì relationship và accountability đòi hỏi chính bạn articulate judgment đó. Đây là về preserving human judgment trong những moments quan trọng."
      },
      {
        q:"Khi nào 'đơn giản hóa prompt' là sai?",
        opts:["Không bao giờ — prompt ngắn luôn tốt hơn","Khi task cần context cụ thể để AI avoid common failure modes, hoặc khi previous simple prompts đã produce bad output — ở đây thêm constraints, examples, và context sẽ improve kết quả","Khi người nhận prompt là AI model yếu hơn","Khi task là creative writing"],
        c:1,
        e:"'Simpler is better' là heuristic tốt cho nhiều cases, nhưng sai với tasks cần precision. Ví dụ: 'Tóm tắt document này' (simple) → AI có thể over-summarize, miss key points, wrong tone. 'Tóm tắt document này trong 3 bullet points, target audience là executives không biết technical details, emphasize business impact, exclude implementation details' → much better. Complexity trong prompt justified khi nó prevents specific failure modes."
      }
    ]
  },
  4:{
    title:"QUIZ GIAI ĐOẠN 4",
    sub:"Đánh Giá Output & Quản Lý Rủi Ro — 5 câu · cần 4/5",
    qs:[
      {
        q:"Khi đánh giá AI output theo chiều 'Completeness' (đầy đủ), bạn đang hỏi điều gì?",
        opts:["Output có đủ dài không?","Output có trả lời đầy đủ câu hỏi không — có dimension quan trọng nào bị bỏ qua không, dù những gì AI nói là đúng?","Output có đủ số lượng bullet points không?","Output có cover đủ background context không?"],
        c:1,
        e:"Completeness ≠ length. AI có thể viết 500 chữ đúng hoàn toàn nhưng miss một điểm quan trọng. Ví dụ: bạn hỏi về risks của một strategy, AI list 5 risks thuyết phục. Nhưng nếu nó miss regulatory risk (vì ít xuất hiện trong training data của domain cụ thể của bạn), output là 'accurate but incomplete' — và incomplete outputs có thể dangerous hơn obviously wrong outputs vì chúng pass casual review."
      },
      {
        q:"'Privacy risk' khi dùng AI tool là gì và cách mitigate?",
        opts:["AI có thể hack vào hệ thống của bạn và steal data","Thông tin confidential bạn input vào AI tool có thể được dùng để train future models hoặc exposed — mitigate bằng cách không input PII, trade secrets, hoặc confidential business info vào public AI tools","AI biết mọi thứ về bạn qua internet","AI tool có thể bị attacker hack để lấy conversation history"],
        c:1,
        e:"Privacy risk là risk dễ bị bỏ qua nhất vì invisible. Khi bạn paste customer data, employee info, hoặc internal financial projections vào ChatGPT để 'phân tích nhanh', bạn đang send confidential info ra khỏi company boundary. Ngay cả với 'no training on your data' policy, data breach risk tồn tại. Rule of thumb: nếu bạn không comfortable đăng nó publicly, không input vào public AI tool."
      },
      {
        q:"'Dependency risk' trong AI workflow là gì?",
        opts:["Nguy cơ AI trở nên phụ thuộc vào input của bạn","Nguy cơ workflow của bạn trở nên quá dependent vào AI — khi AI unavailable, pricing thay đổi, hoặc model behavior changes, bạn không thể operate","Nguy cơ bạn phụ thuộc vào một AI vendor duy nhất về mặt kỹ thuật","Nguy cơ AI model bị deprecated"],
        c:1,
        e:"Dependency risk thường invisible cho đến khi xảy ra. Ví dụ: team xây toàn bộ content pipeline phụ thuộc vào một AI tool → tool tăng giá 10x hoặc change terms → pipeline bị lock. Mitigation: design workflows có AI như một component, không phải infrastructure; maintain human capability để run workflow manually nếu cần; diversify AI vendors cho critical functions."
      },
      {
        q:"'Appropriate reliance' trên AI có nghĩa là gì trong thực hành?",
        opts:["Dùng AI đúng số lần được phép theo policy","Calibrate mức tin tưởng vào AI output với actual reliability của AI cho từng loại task — over-rely là trust AI khi không nên, under-rely là không trust AI khi nó thực sự reliable và helpful","Tham khảo ý kiến AI trước khi ra mọi quyết định","Luôn verify mọi AI output bất kể task type"],
        c:1,
        e:"'Always verify everything' và 'never verify anything' đều là failure modes. Appropriate reliance là về calibration: AI-generated boilerplate email trong context low-stakes? Low verification needed. AI-generated medical information? High verification needed. AI-generated code trong production? Phải review. Mục tiêu là efficient use of your verification attention — apply it where it matters most."
      },
      {
        q:"Khi thiết kế AI Risk Mitigation, tại sao 'likelihood' và 'impact' phải được assess riêng?",
        opts:["Vì đây là format chuẩn của risk matrix","Vì một risk có likelihood thấp nhưng impact cực cao (AI hallucinate trong legal document) cần mitigation khác hoàn toàn so với risk likelihood cao nhưng impact thấp (AI tạo awkward phrasing trong email internal)","Để có đủ content trong document","Chỉ cần assess impact, likelihood không quan trọng bằng"],
        c:1,
        e:"Risk matrix (likelihood × impact) giúp prioritize mitigation effort. Low likelihood + catastrophic impact (một bác sĩ dùng AI diagnosis không verify) → cần hard controls, không phải soft guidelines. High likelihood + low impact (AI occasionally gives off-tone in informal emails) → có thể accept risk. Người không assess riêng thường over-invest mitigating benign risks và under-invest với catastrophic ones."
      }
    ]
  },
  5:{
    title:"QUIZ TỐT NGHIỆP",
    sub:"Tổng Hợp Tư Duy Quản Trị AI — 5 câu · cần 4/5",
    qs:[
      {
        q:"Bạn nhận được AI output rất detailed và confident về một topic quan trọng. Theo tư duy quản trị AI, bước tiếp theo là gì?",
        opts:["Tin tưởng và dùng ngay — detail và confidence là dấu hiệu tốt","Evaluate theo 4 chiều: Accuracy (verify key facts), Completeness (có gì bị miss?), Relevance (có đúng context của bạn không?), Bias (AI có lean về một góc nhìn không?)","Yêu cầu AI tự kiểm tra lại output của nó","Dùng AI khác để cross-check"],
        c:1,
        e:"Detail và confidence trong AI output không correlate với accuracy — đây là một trong những nguyên tắc cốt lõi của chương trình này. 4-chiều evaluation cho phép bạn systematic thay vì intuitive khi assess. Cross-checking with AI khác có thể hữu ích nhưng không thay thế verification với nguồn primary — cả hai AI có thể cùng sai theo cùng cách."
      },
      {
        q:"Sau 90 ngày học, dấu hiệu nào chứng tỏ bạn đã internalize AI governance mindset thực sự?",
        opts:["Bạn biết cách viết prompt tốt và dùng AI thành thạo","Trước khi dùng AI cho bất kỳ task quan trọng nào, câu hỏi tự nhiên xuất hiện trong đầu: 'Task này có phù hợp cho AI không? Input gì cần cung cấp? Output cần verify gì? Risk nào cần mitigate?' — không cần nhắc mình","Bạn có thể giải thích tại sao AI hallucinate cho người khác","Bạn đã đọc đủ tài liệu về AI governance"],
        c:1,
        e:"Mastery là khi framework trở thành default operating mode, không phải checklist cần lookup. Giống như driver có kinh nghiệm không 'remember to check mirrors' — họ check mirrors vì đó là reflex. Khi bạn instinctively apply governance thinking trước khi act, không sau khi nhận ra mình đã không apply nó — đó là mastery."
      },
      {
        q:"Một colleague chia sẻ AI-generated report và nói 'AI đã research và confirm rằng strategy X là đúng'. Bạn phản hồi như thế nào theo tư duy quản trị AI?",
        opts:["Tin tưởng vì colleague đã review rồi","Từ chối dùng AI output trong mọi tình huống","Hỏi: 'AI confirm bằng cách nào? Các claims cụ thể có được verify với nguồn primary không? AI có present counterarguments không?' — vì AI không thể 'confirm' theo nghĩa verify độc lập","Yêu cầu AI tạo report mới cho bạn review trực tiếp"],
        c:2,
        e:"'AI confirmed' là red flag phrase. AI không có khả năng verify độc lập — nó generate text phù hợp với prompt. Nếu prompt là 'argue that strategy X is good', AI sẽ produce convincing arguments FOR X, không phải balanced assessment. 'AI research' thường là sophisticated pattern matching từ training data, không phải research theo nghĩa gather new evidence. Hỏi về methodology là critical thinking in practice."
      },
      {
        q:"Trong AI governance cho team, điều nào sau đây là QUAN TRỌNG NHẤT để đưa vào AI Policy?",
        opts:["List tất cả AI tools được phép và không được phép dùng","Nguyên tắc rõ về: data types nào không được input vào AI (privacy), decisions nào cần human sign-off (accountability), và review cycle để update policy khi AI landscape thay đổi (adaptability)","Training requirements cho mọi nhân viên trước khi dùng AI","KPI để đo lường productivity gain từ AI adoption"],
        c:1,
        e:"Tools list obsoletes nhanh — AI landscape thay đổi liên tục. Privacy, accountability, và adaptability là principles sống lâu hơn. Privacy: protects legal và reputational risk. Accountability: ensure 'AI did it' không trở thành excuse. Adaptability: AI năm sau sẽ khác AI năm nay — policy cần review cycle. Chính sách tốt nhất là principles-based, không rules-based về specific tools."
      },
      {
        q:"Điều gì phân biệt người 'dùng AI' với người có 'AI governance mindset'?",
        opts:["Người có mindset dùng AI nhiều hơn và hiệu quả hơn","Người dùng AI optimize cho output nhanh; người có governance mindset optimize cho output tốt + accountable + sustainable — họ biết khi nào không dùng AI, biết rủi ro của từng use case, và maintain human judgment trong những quyết định quan trọng học cách suy nghĩ khi làm việc với AI","Người có mindset biết dùng nhiều AI tools khác nhau","Người có mindset đã đọc nhiều sách về AI governance"],
        c:1,
        e:"'Dùng AI' là skill. 'AI governance mindset' là framework. Skill cho phép bạn execute. Framework cho phép bạn decide khi nào nên execute, theo cách nào, với safeguards gì, và chịu trách nhiệm như thế nào. Người chỉ có skill có thể rất giỏi dùng AI nhưng create rủi ro mà họ không thấy. Người có cả hai là người dùng AI truly intelligent — và đó là mục tiêu của toàn bộ chương trình này."
      }
    ]
  }
};

let passed = JSON.parse(localStorage.getItem('cognos_passed')||'[]');
let curPhase=null, curQ=0, answers=[], answered=false;
const L = ['A','B','C','D'];

function updateProgress(){
  for(let i=1;i<=5;i++){
    const el=document.getElementById('psi-'+i);
    const ph=document.getElementById('ph-'+i);
    if(passed.includes(i)){
      if(el) el.classList.add('done');
      if(ph) {
        ph.classList.add('completed'); ph.classList.remove('active');
      }
    }
  }
  const p=Math.round((passed.length/5)*100);
  const fill = document.getElementById('prog-fill');
  const lbl = document.getElementById('prog-lbl');
  if(fill) fill.style.width=p+'%';
  if(lbl) lbl.textContent=passed.length+' / 5 giai đoạn hoàn thành — '+p+'% tiến trình';
}

function resetProgress(){
  if(!confirm('Reset toàn bộ tiến độ?')) return;
  localStorage.removeItem('cognos_passed');
  passed=[];
  // Reset UI classes
  for(let i=1;i<=5;i++){
    const el = document.getElementById('psi-'+i);
    const ph = document.getElementById('ph-'+i);
    if(el) el.classList.remove('done');
    if(ph) ph.classList.remove('completed');
  }
  const ph1 = document.getElementById('ph-1');
  if(ph1) ph1.classList.add('active');
  updateProgress();
}

function togglePhase(id){
  document.getElementById(id).classList.toggle('open');
}

function openQuiz(p){
  curPhase=p; curQ=0;
  answers=new Array(QUIZZES[p].qs.length).fill(null);
  answered=false;
  document.getElementById('m-title').textContent=QUIZZES[p].title;
  document.getElementById('m-sub').textContent=QUIZZES[p].sub;
  renderQ();
  document.getElementById('m-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeQuiz(){
  document.getElementById('m-overlay').classList.remove('open');
  document.body.style.overflow='';
}

function renderQ(){
  const d=QUIZZES[curPhase], q=d.qs[curQ], tot=d.qs.length;
  const pct=Math.round((curQ/tot)*100);
  let html=`
    <div class="qpb"><div class="qpb-fill" style="width:${pct}%"></div><div class="qpb-lbl">Câu ${curQ+1}/${tot}</div></div>
    <div class="q-tag">// Câu hỏi ${curQ+1}</div>
    <div class="q-text">${q.q}</div>
    <ul class="q-opts">`;
  q.opts.forEach((o,i)=>{
    const sel=answers[curQ]===i?'selected':'';
    html+=`<li class="q-opt ${sel}" onclick="pickOpt(${i})">
      <span class="q-ltr">${L[i]}</span><span>${o}</span>
    </li>`;
  });
  html+=`</ul>
    <div class="q-exp" id="q-exp">${q.e}</div>
    <div class="q-nav">
      <div class="q-stat">${answers[curQ]!==null?'✓ Đã chọn':'Chọn một đáp án'}</div>
      <button class="btn-nxt" id="btn-nxt" onclick="nextQ()" ${answers[curQ]===null?'disabled':''}>
        ${curQ<tot-1?'TIẾP THEO →':'XEM KẾT QUẢ →'}
      </button>
    </div>`;
  document.getElementById('m-body').innerHTML=html;
}

function pickOpt(i){
  if(answered) return;
  answers[curQ]=i; answered=true;
  const q=QUIZZES[curPhase].qs[curQ];
  document.querySelectorAll('.q-opt').forEach((el,idx)=>{
    if(idx===q.c) el.classList.add('correct');
    else if(idx===i&&i!==q.c) el.classList.add('wrong');
    el.style.pointerEvents='none';
    el.querySelector('.q-ltr').textContent=idx===q.c?'✓':(idx===i?'✗':L[idx]);
  });
  document.getElementById('q-exp').classList.add('show');
  document.getElementById('btn-nxt').disabled=false;
  document.querySelector('.q-stat').innerHTML=i===q.c
    ?'<span style="color:var(--green);font-weight:700">✓ Chính xác!</span>'
    :'<span style="color:var(--red);font-weight:700">✗ Chưa đúng</span>';
}

function nextQ(){
  const d=QUIZZES[curPhase];
  if(curQ<d.qs.length-1){
    curQ++; answered=answers[curQ]!==null; renderQ();
    if(answered){
      const q=d.qs[curQ], idx=answers[curQ];
      document.querySelectorAll('.q-opt').forEach((el,i)=>{
        if(i===q.c) el.classList.add('correct');
        else if(i===idx&&idx!==q.c) el.classList.add('wrong');
        el.style.pointerEvents='none';
        el.querySelector('.q-ltr').textContent=i===q.c?'✓':(i===idx?'✗':L[i]);
      });
      document.getElementById('q-exp').classList.add('show');
    }
  } else { showResult(); }
}

function showResult(){
  const d=QUIZZES[curPhase];
  let correct=0;
  answers.forEach((a,i)=>{ if(a===d.qs[i].c) correct++; });
  const ok=correct>=4;
  if(ok&&!passed.includes(curPhase)){
    passed.push(curPhase);
    localStorage.setItem('cognos_passed',JSON.stringify(passed));
    
    // Sync with Nexus Profile
    if (typeof updateProgress === 'function') {
      updateProgress('cognos', curPhase);
    }
    
    updateProgress(); // Local UI update
  }
  const msg=ok
    ?`Xuất sắc! Bạn đã xác nhận nắm vững Giai đoạn ${curPhase}. ${curPhase<5?'Tiếp tục sang Giai đoạn '+(curPhase+1)+'!':'Chúc mừng — bạn đã hoàn thành toàn bộ chương trình COGNOS!'}`
    :`Bạn đạt ${correct}/5 — chưa đạt ngưỡng pass. Hãy ôn lại nội dung Giai đoạn ${curPhase} ít nhất 7 ngày trước khi thử lại.`;
  document.getElementById('m-body').innerHTML=`
    <div class="result-wrap">
      <div class="res-score ${ok?'pass':'fail'}">${correct}/5</div>
      <div class="res-verdict ${ok?'pass':'fail'}">${ok?'✓ PASS — ĐẠT YÊU CẦU':'✗ FAIL — CHƯA ĐẠT'}</div>
      <div class="res-msg">${msg}</div>
      <div class="res-actions">
        ${!ok?`<button class="btn-quiz" onclick="openQuiz(${curPhase})" style="padding:11px 22px;">↺ Thử Lại</button>`:''}
        <button class="btn-start" onclick="closeQuiz()" style="font-size:10px;padding:13px 26px;">
          ${ok&&curPhase<5?'→ GIAI ĐOẠN '+(curPhase+1):'✓ ĐÓNG'}
        </button>
      </div>
    </div>`;
}

// ── DOCS FUNCTIONS ──
function openDocs() {
  document.body.classList.add('docs-open');
  const overlay = document.getElementById('docs-overlay');
  if (overlay) overlay.style.display = 'block';
  setTimeout(() => {
    const drawer = document.getElementById('docs-drawer');
    if (drawer) drawer.classList.add('open');
    checkDocsLock();
  }, 10);
}

function closeDocs() {
  document.body.classList.remove('docs-open');
  const drawer = document.getElementById('docs-drawer');
  if (drawer) drawer.classList.remove('open');
  setTimeout(() => {
    const overlay = document.getElementById('docs-overlay');
    if (overlay) overlay.style.display = 'none';
  }, 400);
}

function showDocSection(id, btn) {
  document.querySelectorAll('.docs-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('doc-' + id);
  if (target) target.classList.add('active');
  document.querySelectorAll('.docs-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const content = document.getElementById('docs-content');
  if (content) content.scrollTop = 0;
}

function checkDocsLock() {
  const activeUser = localStorage.getItem('nexus_active_profile');
  let passedPhases = [];
  
  if (activeUser) {
    const userData = JSON.parse(localStorage.getItem('nexus_data_' + activeUser) || '{}');
    passedPhases = userData.cognos?.phasesPassed || [];
  } else {
    passedPhases = JSON.parse(localStorage.getItem('cognos_passed') || '[]');
  }

  const scanLock = document.getElementById('lock-scan');
  const actLock = document.getElementById('lock-act');
  const checkLock = document.getElementById('lock-check');

  if (scanLock) scanLock.style.display = passedPhases.includes(1) ? 'none' : 'flex';
  if (actLock) actLock.style.display = passedPhases.includes(3) ? 'none' : 'flex';
  if (checkLock) checkLock.style.display = passedPhases.includes(4) ? 'none' : 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    const overlay = document.getElementById('m-overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeQuiz();
        });
    }
});
