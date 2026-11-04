const form=document.getElementById('loginForm');
const email=document.getElementById('email'), password=document.getElementById('password');
const emailError=document.getElementById('emailError'), passwordError=document.getElementById('passwordError');
const notice=document.getElementById('formNotice'), toggle=document.getElementById('togglePassword'), submit=document.getElementById('submitBtn');
function message(text,type='info'){notice.textContent=text;notice.className='notice show '+type}
function clearMessage(){notice.textContent='';notice.className='notice'}
toggle.addEventListener('click',()=>{const show=password.type==='password';password.type=show?'text':'password';toggle.innerHTML=show?'<i class="fa-regular fa-eye-slash"></i>':'<i class="fa-regular fa-eye"></i>';toggle.setAttribute('aria-label',show?'Hide password':'Show password')});
function checkEmail(){const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());emailError.textContent=valid?'':(!email.value.trim()?'Email address is required.':'Enter a valid email address.');email.closest('.input-wrap').classList.toggle('invalid',!valid);return valid}
function checkPassword(){const valid=password.value.length>=6;passwordError.textContent=valid?'':(!password.value?'Password is required.':'Use at least 6 characters for this demo.');password.closest('.input-wrap').classList.toggle('invalid',!valid);return valid}
email.addEventListener('input',()=>{emailError.textContent='';email.closest('.input-wrap').classList.remove('invalid');clearMessage()});
password.addEventListener('input',()=>{passwordError.textContent='';password.closest('.input-wrap').classList.remove('invalid');clearMessage()});
form.addEventListener('submit',e=>{e.preventDefault();if(!checkEmail()||!checkPassword()){message('Check the highlighted fields and try again.','error');return}message('Demo sign-in successful. No real account was checked. Click “Open dashboard” to continue.','success');submit.innerHTML='Open dashboard <i class="fa-solid fa-arrow-right"></i>';submit.onclick=()=>{window.location.href='dashboard.html'}});
document.getElementById('forgotPassword').addEventListener('click',e=>{e.preventDefault();message('Password recovery is not connected in this student demo. A real system would send a secure reset link to your registered email.','info')});
