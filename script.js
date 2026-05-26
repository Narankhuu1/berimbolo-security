// ─── AUTH ───
const USERS = {
  admin: { pass: 'admin123', name: 'Ройс Беримболо', role: 'Захирал', init: 'РБ' },
  office: { pass: 'office123', name: 'Жеймс Де Соуса', role: 'Оффисын ажилтан', init: 'ЖД' },
  engineer: { pass: 'eng123', name: 'Лу Чен', role: 'Инженер', init: 'ЛЧ' },
  sara: { pass: 'sara123', name: 'Сара Миклетвейт', role: 'Оффисын ажилтан', init: 'СМ' },
};

let currentRole = 'admin';
let currentUser = null;
let chatOpen = false;


// ─── APPLY MODAL ───
function openApplyModal(service) {
  document.getElementById('applyServiceTag').textContent = '🛡 ' + service;
  document.getElementById('applyModal').classList.add('open');
  document.getElementById('applyError').classList.remove('show');
  document.getElementById('applyFormBody').style.display = 'flex';
  document.getElementById('applySuccess').classList.remove('show');
  // Reset form
  ['apName', 'apPhone', 'apEmail', 'apAddr', 'apRooms', 'apNote'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}
function closeApplyModal() {
  document.getElementById('applyModal').classList.remove('open');
}
function submitApply() {
  const name = document.getElementById('apName').value.trim();
  const phone = document.getElementById('apPhone').value.trim();
  const email = document.getElementById('apEmail')?.value.trim() || '';
  const addr = document.getElementById('apAddr').value.trim();
  const rooms = document.getElementById('apRooms')?.value.trim() || '';
  const note = document.getElementById('apNote')?.value.trim() || '';
  const service = document.getElementById('applyServiceTag')?.textContent?.replace('🛡 ', '') || 'Үйлчилгээ';
  const err = document.getElementById('applyError');
  const btnText = document.getElementById('apBtnText');
  const btnSpinner = document.getElementById('apBtnSpinner');

  if (!name || !phone || !addr) {
    err.classList.add('show');
    return;
  }
  err.classList.remove('show');

  if (btnText) btnText.textContent = 'Илгээж байна...';
  if (btnSpinner) btnSpinner.style.display = 'inline-block';

  setTimeout(() => {
    // Save order to system
    addOrder({
      name: name,
      phone: phone,
      email: email,
      service: service,
      address: addr,
      rooms: rooms,
      note: note
    });

    document.getElementById('applyFormBody').style.display = 'none';
    document.getElementById('applySuccess').classList.add('show');
    if (btnText) btnText.textContent = 'Захиалга илгээх →';
    if (btnSpinner) btnSpinner.style.display = 'none';
    showToast('✓ Захиалга амжилттай илгээгдлээ! Ажилтны порталд харагдана.');
  }, 1200);
}

// ─── NOTIFY MODAL ───
function openNotifyModal(service) {
  document.getElementById('notifyServiceTag').textContent = '⏳ ' + service;
  document.getElementById('notifyModal').classList.add('open');
  document.getElementById('notifyError').classList.remove('show');
  document.getElementById('notifyFormBody').style.display = 'flex';
  document.getElementById('notifySuccess').classList.remove('show');
  ['ntName', 'ntEmail', 'ntPhone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}
function closeNotifyModal() {
  document.getElementById('notifyModal').classList.remove('open');
}
function submitNotify() {
  const name = document.getElementById('ntName').value.trim();
  const email = document.getElementById('ntEmail').value.trim();
  const phone = document.getElementById('ntPhone')?.value.trim() || '';
  const service = document.getElementById('notifyServiceTag')?.textContent?.replace('⏳ ', '') || 'Удахгүй';
  const err = document.getElementById('notifyError');
  const btnText = document.getElementById('ntBtnText');
  const btnSpinner = document.getElementById('ntBtnSpinner');

  if (!name || !email) {
    err.classList.add('show');
    return;
  }
  err.classList.remove('show');

  if (btnText) btnText.textContent = 'Бүртгэж байна...';
  if (btnSpinner) btnSpinner.style.display = 'inline-block';

  setTimeout(() => {
    // Save as pre-order
    addOrder({
      name: name,
      phone: phone,
      email: email,
      service: service + ' (Урьдчилсан бүртгэл)',
      address: 'Урьдчилсан бүртгэл',
      note: 'Үйлчилгээ бэлэн болмогц мэдэгдэл илгээх'
    });

    document.getElementById('notifyFormBody').style.display = 'none';
    document.getElementById('notifySuccess').classList.add('show');
    if (btnText) btnText.textContent = 'Бүртгүүлэх →';
    if (btnSpinner) btnSpinner.style.display = 'none';
    showToast('✓ Мэдэгдэл бүртгэгдлээ! Ажилтны порталд харагдана.');
  }, 1000);
}

// ─── INFO MODALS ───
const PRIVACY_CONTENT = `
  <h3>🔒 Нууцлалын бодлого</h3>
  <p>Berimbolo Security нь таны хувийн мэдээллийг хамгаалахад бүрэн хариуцлагатай хандаж байна.</p>
  <h4>1. Мэдээлэл цуглуулах</h4>
  <p>Бид таны нэр, холбоо барих мэдээлэл, хаяг зэргийг зөвхөн үйлчилгээ үзүүлэх зорилгоор цуглуулдаг.</p>
  <h4>2. Мэдээлэл хамгаалах</h4>
  <p>Таны мэдээлэл шифрлэгдсэн хэлбэрээр хадгалагдаж, гуравдагч этгээдэд дамжуулагдахгүй.</p>
  <h4>3. Күүки</h4>
  <p>Бид сайтын ажиллагааг сайжруулах зорилгоор күүки ашигладаг. Та хүсвэл түүнийг идэвхгүй болгож болно.</p>
  <h4>4. Холбоо барих</h4>
  <p>Нууцлалын бодлоготой холбоотой асуулт байвал info@berimbolo.mn хаягаар холбоо барина уу.</p>
`;

const TERMS_CONTENT = `
  <h3>📋 Үйлчилгээний нөхцөл</h3>
  <p>Berimbolo Security-ийн үйлчилгээг ашиглахдаа дараах нөхцөлийг хүлээн зөвшөөрч байна.</p>
  <h4>1. Ерөнхий нөхцөл</h4>
  <ul>
    <li>Үйлчилгээний төлбөрийг урьдчилан төлнө</li>
    <li>Суурилуулалтын өмнө гэрээ байгуулна</li>
    <li>Баталгаат хугацаа: 12 сар</li>
  </ul>
  <h4>2. Баталгаа</h4>
  <ul>
    <li>Тоног төхөөрөмж: 24 сарын баталгаа</li>
    <li>Суурилуулалт: 12 сарын баталгаа</li>
    <li>Үнэгүй засвар үйлчилгээ: баталгаат хугацаанд</li>
  </ul>
  <h4>3. Төлбөр буцаах</h4>
  <p>Суурилуулалт эхлээгүй тохиолдолд 100% төлбөр буцаана. Ажил эхэлсэн тохиолдолд материалын зардал хасна.</p>
  <h4>4. Хариуцлага</h4>
  <p>Бид системийн техникийн алдаанаас үүсэх хохирлыг хариуцна. Гэхдээ хэрэглэгчийн буруутай үйлдлээс үүссэн хохирлыг хариуцахгүй.</p>
`;

function openInfoModal(type) {
  const content = document.getElementById('infoModalContent');
  if (content) content.innerHTML = type === 'privacy' ? PRIVACY_CONTENT : TERMS_CONTENT;
  document.getElementById('infoModal').classList.add('open');
}
function closeInfoModal() {
  document.getElementById('infoModal').classList.remove('open');
}

// ─── LOGIN ───
function openLogin() {
  document.getElementById('loginModal').classList.add('open');
  document.getElementById('loginError').classList.remove('show');
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  setTimeout(() => document.getElementById('loginUser').focus(), 100);
}
function closeLogin() {
  document.getElementById('loginModal').classList.remove('open');
}
function setRole(r, e) {
  currentRole = r;
  document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
  if (e && e.target) e.target.classList.add('active');
}
function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');
  const btnText = document.getElementById('loginBtnText');
  const btnSpinner = document.getElementById('loginBtnSpinner');

  if (btnText) btnText.textContent = 'Нэвтэрч байна...';
  if (btnSpinner) btnSpinner.style.display = 'inline-block';

  setTimeout(() => {
    if (USERS[u] && USERS[u].pass === p) {
      currentUser = { ...USERS[u], key: u };
      errEl.classList.remove('show');
      closeLogin();
      showDashboard();
      showToast('✓ Амжилттай нэвтэрлээ!');
    } else {
      errEl.classList.add('show');
      document.getElementById('loginPass').value = '';
      document.getElementById('loginPass').focus();
    }
    if (btnText) btnText.textContent = 'Нэвтрэх →';
    if (btnSpinner) btnSpinner.style.display = 'none';
  }, 800);
}
function doLogout() {
  currentUser = null;
  document.getElementById('dashboard').classList.remove('active');
  document.getElementById('site').style.display = 'block';
  window.scrollTo(0, 0);
  showToast('Системээс гарлаа');
}
function showDashboard() {
  document.getElementById('site').style.display = 'none';
  const dash = document.getElementById('dashboard');
  dash.classList.add('active');
  document.getElementById('dashUserName').textContent = currentUser.name;
  document.getElementById('dashUserRole').textContent = currentUser.role;
  document.getElementById('dashUserAvatar').textContent = currentUser.init;

  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  const dateEl = document.getElementById('currentDate');
  if (dateEl) dateEl.textContent = now.toLocaleDateString('mn-MN', options);
  const apptDateEl = document.getElementById('apptDateLabel');
  if (apptDateEl) apptDateEl.textContent = now.toISOString().split('T')[0].replace(/-/g, '.');

  showPanel('overview');
}

// ─── PANELS ───
function showPanel(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');
  document.querySelectorAll('.sidebar-link').forEach(l => {
    if (l.getAttribute('onclick') && l.getAttribute('onclick').includes("'" + id + "'")) {
      l.classList.add('active');
    }
  });
}

// ─── CONTACT FORM ───
function submitContact() {
  const name = document.getElementById('cfName').value.trim();
  const email = document.getElementById('cfEmail').value.trim();
  const phone = document.getElementById('cfPhone').value.trim();
  const service = document.getElementById('cfService').value;
  const addr = document.getElementById('cfAddr')?.value.trim() || '';
  const note = document.getElementById('cfMsg')?.value.trim() || '';
  const err = document.getElementById('cfError');
  const btnText = document.getElementById('cfBtnText');
  const btnSpinner = document.getElementById('cfBtnSpinner');

  if (!name || !email || !phone || !service) {
    err.style.display = 'block';
    err.textContent = 'Бүх заавал бөглөх талбаруудыг бөглөнө үү.';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    err.style.display = 'block';
    err.textContent = 'И-мэйл хаяг буруу байна.';
    return;
  }

  err.style.display = 'none';
  if (btnText) btnText.textContent = 'Илгээж байна...';
  if (btnSpinner) btnSpinner.style.display = 'inline-block';

  setTimeout(() => {
    // Save to dashboard as well
    addOrder({
      name: name,
      phone: phone,
      email: email,
      service: service === 'Бусад' ? 'Холбоо барих хүсэлт' : service,
      address: addr,
      note: note
    });

    if (btnText) btnText.textContent = 'Хүсэлт илгээх →';
    if (btnSpinner) btnSpinner.style.display = 'none';
    showToast('✓ Таны хүсэлт амжилттай илгээгдлээ! Ажилтны порталд харагдана.');
    ['cfName', 'cfEmail', 'cfPhone', 'cfAddr', 'cfMsg'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('cfService').value = '';
  }, 1500);
}

// ─── CUSTOMERS ───
function openCustomerForm() {
  document.getElementById('customerFormCard').style.display = 'block';
  document.getElementById('customerFormCard').scrollIntoView({ behavior: 'smooth' });
}
function closeCustomerForm() {
  document.getElementById('customerFormCard').style.display = 'none';
}
function addCustomer() {
  const n = document.getElementById('cName').value.trim();
  const ph = document.getElementById('cPhone').value.trim();
  const sys = document.getElementById('cSystem').value;
  const addr = document.getElementById('cAddr').value.trim();
  if (!n) { showToast('Нэр оруулна уу!', true); return; }
  const row = document.createElement('tr');
  row.innerHTML = `<td>${n}</td><td>${ph||'—'}</td><td>${sys}</td><td>${addr||'—'}</td><td><span class="badge badge-blue">Шинэ</span></td><td><button class="appt-btn" onclick="viewCustomer(this)">Харах</button></td>`;
  document.getElementById('customerBody').prepend(row);
  closeCustomerForm();
  ['cName','cPhone','cEmail','cAddr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  showToast('✓ Хэрэглэгч нэмэгдлээ!');
  const statEl = document.getElementById('statCustomers');
  if (statEl) statEl.textContent = parseInt(statEl.textContent) + 1;
}
function searchCustomers() {
  const query = document.getElementById('customerSearch').value.toLowerCase();
  const rows = document.getElementById('customerBody').querySelectorAll('tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}
function viewCustomer(btn) {
  const row = btn.closest('tr');
  const name = row.cells[0].textContent;
  showToast(`Хэрэглэгч: ${name} — Дэлгэрэнгүй мэдээлэл`);
}

// ─── APPOINTMENTS ───
function openApptModal() {
  document.getElementById('apptModal').classList.add('open');
}
function closeApptModal() {
  document.getElementById('apptModal').classList.remove('open');
}
function saveAppt() {
  const name = document.getElementById('aName').value.trim();
  const time = document.getElementById('aTime').value;
  const svc = document.getElementById('aService').value;
  const eng = document.getElementById('aEngineer').value;
  const addr = document.getElementById('aAddr').value.trim();
  if (!name) { showToast('Нэр оруулна уу!', true); return; }
  const item = document.createElement('div');
  item.className = 'appt-item';
  item.innerHTML = `
    <div class="appt-time">${time}</div>
    <div class="appt-info">
      <div class="appt-name">${name} — ${svc}</div>
      <div class="appt-detail">📍 ${addr||'Хаяг оруулаагүй'} · Инженер: ${eng}</div>
    </div>
    <span class="badge badge-blue">Шинэ</span>
    <div class="appt-actions"><button class="appt-btn" onclick="editAppt(this)">Засах</button></div>
  `;
  document.getElementById('apptList').appendChild(item);
  closeApptModal();
  ['aName','aAddr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  showToast('✓ Цаг товлолт нэмэгдлээ!');
  const statEl = document.getElementById('statAppts');
  if (statEl) statEl.textContent = parseInt(statEl.textContent) + 1;
}
function editAppt(btn) {
  showToast('Засах функц ажиллаж байна...');
}
function cancelAppt(btn) {
  if (confirm('Энэ цаг товлолтыг цуцлах уу?')) {
    btn.closest('.appt-item').remove();
    showToast('✓ Цаг товлолт цуцлагдлаа');
    const statEl = document.getElementById('statAppts');
    if (statEl) statEl.textContent = parseInt(statEl.textContent) - 1;
  }
}
function filterAppointments() {
  const date = document.getElementById('apptDateFilter').value;
  if (date) {
    const dateEl = document.getElementById('apptDateLabel');
    if (dateEl) dateEl.textContent = date.replace(/-/g, '.');
    showToast(`Цаг товлолт шүүлтүүр: ${date}`);
  }
}

// ─── JOBS ───
function updateJobStatus(select) {
  const status = select.value;
  const card = select.closest('.job-card');
  showToast(`Ажлын байдал шинэчлэгдлээ: ${status}`);
  if (status === 'Дууссан') {
    card.style.opacity = '0.6';
    setTimeout(() => {
      card.style.transition = 'all 0.5s';
      card.style.transform = 'translateX(100%)';
      card.style.opacity = '0';
      setTimeout(() => card.remove(), 500);
    }, 1000);
  }
}
function approveSupply(btn) {
  const row = btn.closest('tr');
  const badge = row.querySelector('.badge');
  if (badge) {
    badge.className = 'badge badge-green';
    badge.textContent = 'Баталгаажсан';
  }
  btn.disabled = true;
  btn.textContent = 'Батлагдсан';
  showToast('✓ Хангамж баталгаажлаа');
}

// ─── CCTV ───
function openCCTV(camId) {
  showToast(`${camId} — CCTV хяналт нээгдлээ`);
}
function checkSystem(customer) {
  showToast(`${customer} — Систем шалгагдаж байна...`);
  setTimeout(() => {
    showToast(`✓ ${customer} — Систем хэвийн байна`);
  }, 1500);
}

// ─── STAFF ───
function messageStaff(name) {
  showToast(`${name}-д мессеж илгээх...`);
}

// ─── REPORTS ───
function updateReports() {
  const period = document.getElementById('reportPeriod').value;
  const labels = { month: 'энэ сар', quarter: 'энэ улирал', year: 'энэ жил' };
  showToast(`Тайлан шинэчлэгдлээ: ${labels[period]}`);
}
function exportReport() {
  showToast('📥 Тайлан татаж авж байна...');
  setTimeout(() => {
    showToast('✓ Тайлан амжилттай татаж авлаа!');
  }, 1500);
}

// ─── DASHBOARD SEARCH ───
function searchDashboard() {
  const query = document.getElementById('dashSearch').value.toLowerCase();
  const activePanel = document.querySelector('.panel.active');
  if (activePanel) {
    const items = activePanel.querySelectorAll('tr, .appt-item, .job-card');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });
  }
}
function refreshDashboard() {
  showToast('🔄 Дашбоард шинэчлэгдэж байна...');
  setTimeout(() => {
    showToast('✓ Дашбоард шинэчлэгдлээ!');
  }, 1000);
}

// ─── CHAT ───
function toggleChat() {
  chatOpen = !chatOpen;
  if (chatOpen) {
    showToast('💬 Live Chat нээгдлээ — Ажилтанд холбогдож байна...');
  }
}

// ─── TOAST ───
function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast' + (isError ? ' error' : '') + ' show';
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ─── MODAL CLOSE ON OVERLAY CLICK ───
document.addEventListener('DOMContentLoaded', () => {
  const loginModal = document.getElementById('loginModal');
  const apptModal = document.getElementById('apptModal');
  const applyModal = document.getElementById('applyModal');
  const notifyModal = document.getElementById('notifyModal');
  const infoModal = document.getElementById('infoModal');

  if (loginModal) loginModal.addEventListener('click', (e) => { if (e.target === loginModal) closeLogin(); });
  if (apptModal) apptModal.addEventListener('click', (e) => { if (e.target === apptModal) closeApptModal(); });
  if (applyModal) applyModal.addEventListener('click', (e) => { if (e.target === applyModal) closeApplyModal(); });
  if (notifyModal) notifyModal.addEventListener('click', (e) => { if (e.target === notifyModal) closeNotifyModal(); });
  if (infoModal) infoModal.addEventListener('click', (e) => { if (e.target === infoModal) closeInfoModal(); });

  // Order detail modal close on overlay click
  const orderDetailModal = document.getElementById('orderDetailModal');
  if (orderDetailModal) orderDetailModal.addEventListener('click', (e) => { if (e.target === orderDetailModal) closeOrderDetail(); });
});

// ─── KEYBOARD SHORTCUTS ───
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLogin();
    closeApplyModal();
    closeNotifyModal();
    closeInfoModal();
    closeApptModal();
    closeMobileMenu();
  }
});

// ─── COUNTER ANIMATION ───
function animateCounter(el) {
  if (!el) return;
  const target = parseInt(el.getAttribute('data-count'));
  const duration = 2000;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeOut * target);

    if (target === 24) {
      el.textContent = current;
    } else if (target === 98) {
      el.textContent = current;
    } else {
      el.textContent = current + '+';
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (target === 24) el.textContent = '24/7';
      if (target === 98) el.textContent = '98%';
    }
  }
  requestAnimationFrame(update);
}

// ─── NAVIGATION ───
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    closeMobileMenu();
  }
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ─── ORDERS STORAGE ───
let orders = JSON.parse(localStorage.getItem('berimbolo_orders') || '[]');
let currentOrderId = null;

function saveOrders() {
  localStorage.setItem('berimbolo_orders', JSON.stringify(orders));
}

function addOrder(order) {
  order.id = Date.now();
  order.date = new Date().toLocaleDateString('mn-MN');
  order.time = new Date().toLocaleTimeString('mn-MN', {hour: '2-digit', minute:'2-digit'});
  order.status = 'Шинэ';
  order.assignedTo = '';
  orders.unshift(order);
  saveOrders();
  renderOrders();
  showToast('✓ Шинэ захиалга ирлээ!');

  // Update stats
  const statEl = document.getElementById('statAppts');
  if (statEl) statEl.textContent = parseInt(statEl.textContent) + 1;
}

function renderOrders() {
  const tbody = document.getElementById('ordersBody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = '<tr id="noOrdersRow"><td colspan="7" style="text-align:center; color:var(--muted); padding:24px;">Одоогоор шинэ захиалга байхгүй. Вэбсайтаар захиалга өгөгдсөнөөр энд харагдана.</td></tr>';
    document.getElementById('newOrdersCount').textContent = '0 шинэ';
    return;
  }

  tbody.innerHTML = orders.map(order => `
    <tr data-order-id="${order.id}">
      <td>${order.date}<br><small style="color:var(--muted)">${order.time}</small></td>
      <td><strong>${order.name}</strong></td>
      <td>${order.service}</td>
      <td>${order.phone}</td>
      <td>${order.address || '—'}</td>
      <td><span class="badge ${getStatusBadge(order.status)}">${order.status}</span></td>
      <td>
        <button class="appt-btn" onclick="viewOrderDetail(${order.id})">Харах</button>
        <button class="appt-btn" onclick="deleteOrder(${order.id})" style="color:var(--danger); border-color:rgba(248,81,73,0.3);">Устгах</button>
      </td>
    </tr>
  `).join('');

  const newCount = orders.filter(o => o.status === 'Шинэ').length;
  document.getElementById('newOrdersCount').textContent = newCount + ' шинэ';
}

function getStatusBadge(status) {
  const map = { 'Шинэ': 'badge-blue', 'Баталгаажсан': 'badge-green', 'Хийгдэж байна': 'badge-yellow', 'Дууссан': 'badge-green', 'Цуцлагдсан': 'badge-red' };
  return map[status] || 'badge-blue';
}

function viewOrderDetail(id) {
  const order = orders.find(o => o.id === id);
  if (!order) return;
  currentOrderId = id;

  const content = document.getElementById('orderDetailContent');
  content.innerHTML = `
    <div style="background:var(--dark); padding:16px; border-radius:8px; border:1px solid var(--border);">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:14px;">
        <div><strong style="color:var(--muted);">Захиалгын №:</strong> #${order.id}</div>
        <div><strong style="color:var(--muted);">Огноо:</strong> ${order.date} ${order.time}</div>
        <div><strong style="color:var(--muted);">Хэрэглэгч:</strong> ${order.name}</div>
        <div><strong style="color:var(--muted);">Утас:</strong> ${order.phone}</div>
        <div><strong style="color:var(--muted);">И-мэйл:</strong> ${order.email || '—'}</div>
        <div><strong style="color:var(--muted);">Үйлчилгээ:</strong> ${order.service}</div>
        <div style="grid-column:1/-1;"><strong style="color:var(--muted);">Хаяг:</strong> ${order.address || '—'}</div>
        <div style="grid-column:1/-1;"><strong style="color:var(--muted);">Тэмдэглэл:</strong> ${order.note || '—'}</div>
        <div style="grid-column:1/-1;"><strong style="color:var(--muted);">Өрөө/Давхар:</strong> ${order.rooms || '—'}</div>
        <div style="grid-column:1/-1;">
          <strong style="color:var(--muted);">Байдал:</strong> 
          <select id="orderStatusSelect" style="background:var(--panel); border:1px solid var(--border); color:var(--white); padding:6px 12px; border-radius:var(--radius); font-family:inherit;" onchange="updateOrderStatus(${order.id}, this.value)">
            <option ${order.status==='Шинэ'?'selected':''}>Шинэ</option>
            <option ${order.status==='Баталгаажсан'?'selected':''}>Баталгаажсан</option>
            <option ${order.status==='Хийгдэж байна'?'selected':''}>Хийгдэж байна</option>
            <option ${order.status==='Дууссан'?'selected':''}>Дууссан</option>
            <option ${order.status==='Цуцлагдсан'?'selected':''}>Цуцлагдсан</option>
          </select>
        </div>
        <div style="grid-column:1/-1;">
          <strong style="color:var(--muted);">Инженер оноох:</strong>
          <select id="orderEngineerSelect" style="background:var(--panel); border:1px solid var(--border); color:var(--white); padding:6px 12px; border-radius:var(--radius); font-family:inherit;" onchange="assignEngineer(${order.id}, this.value)">
            <option value="">— Сонгоно уу —</option>
            <option ${order.assignedTo==='Лу Чен'?'selected':''}>Лу Чен</option>
            <option ${order.assignedTo==='Даррен Уильямс'?'selected':''}>Даррен Уильямс</option>
          </select>
          ${order.assignedTo ? '<span style="color:var(--accent); margin-left:8px;">✓ ' + order.assignedTo + '</span>' : ''}
        </div>
      </div>
    </div>
  `;

  document.getElementById('orderDetailModal').classList.add('open');
}

function closeOrderDetail() {
  document.getElementById('orderDetailModal').classList.remove('open');
  currentOrderId = null;
}

function updateOrderStatus(id, status) {
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    saveOrders();
    renderOrders();
    showToast('✓ Захиалгын байдал шинэчлэгдлээ: ' + status);
  }
}

function assignEngineer(id, engineer) {
  const order = orders.find(o => o.id === id);
  if (order && engineer) {
    order.assignedTo = engineer;
    order.status = 'Хийгдэж байна';
    saveOrders();
    renderOrders();
    showToast('✓ ' + engineer + ' инженерт оноогдлоо');

    // Refresh the detail view
    viewOrderDetail(id);
  }
}

function assignOrder() {
  const engineer = document.getElementById('orderEngineerSelect')?.value;
  if (engineer && currentOrderId) {
    assignEngineer(currentOrderId, engineer);
  }
}

function deleteOrder(id) {
  if (confirm('Энэ захиалгыг устгах уу?')) {
    orders = orders.filter(o => o.id !== id);
    saveOrders();
    renderOrders();
    showToast('✓ Захиалга устгагдлаа');
  }
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  // Set current date for appointment filter
  const today = new Date().toISOString().split('T')[0];
  const apptFilter = document.getElementById('apptDateFilter');
  if (apptFilter) apptFilter.value = today;

  // Trigger hero counter animations immediately
  document.querySelectorAll('.hero-stats [data-count]').forEach(counter => {
    animateCounter(counter);
  });

  // Ensure all content is visible (safety check)
  document.querySelectorAll('section, .hero-content, .services-grid, .about-grid, .order-cards, .contact-grid, .pricing-grid, .testimonials-grid').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  // Render any existing orders
  renderOrders();
});