const messageEl = document.getElementById('flash-message');

if (messageEl) {
  setTimeout(() => {
    messageEl.style.transition = "opacity 0.5s ease, transform 0.5s ease"; 
    messageEl.style.opacity = "0";
    messageEl.style.transform = "translateX(-50%) translateY(-20px)";
    
    setTimeout(() => {
      messageEl.remove();
    }, 500);
  }, 3000); // 3 seconden
}