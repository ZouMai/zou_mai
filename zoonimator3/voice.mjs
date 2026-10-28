export class Voice{
 constructor(status){this.status=status;this.auto=false;this.recognition=null;this.enabled='speechSynthesis'in globalThis;this.SR=globalThis.SpeechRecognition||globalThis.webkitSpeechRecognition;}
 speak(text,force=false){if(!this.enabled||(!force&&!this.auto))return;this.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='fr-FR';u.rate=.93;u.onerror=e=>{if(!['canceled','interrupted'].includes(e.error))this.status('La lecture vocale n’est pas disponible. Le texte reste affiché.');};speechSynthesis.speak(u);}
 cancel(){if(this.enabled)speechSynthesis.cancel();}
 stop(){this.recognition?.abort();this.recognition=null;this.cancel();}
 listen(onResult){if(!this.SR){this.status('La reconnaissance vocale est indisponible ici. Utilise le clavier ou les boutons.');return;}
  this.stop();const r=new this.SR();this.recognition=r;r.lang='fr-FR';r.interimResults=false;r.maxAlternatives=1;
  r.onstart=()=>this.status('Je t’écoute…');
  r.onresult=e=>{onResult(e.results[0][0].transcript);this.status('Vérifie le texte reconnu, puis valide.');};
  r.onerror=e=>this.status(e.error==='not-allowed'?'Le microphone n’est pas autorisé. Tu peux continuer au clavier.':e.error==='aborted'?'Écoute arrêtée.':'L’écoute a échoué. Réessaie ou utilise le clavier.');
  r.onend=()=>{if(this.recognition===r)this.recognition=null;};
  try{r.start();}catch{this.status('Le microphone ne peut pas démarrer. Réessaie dans un navigateur compatible.');}
 }
}
