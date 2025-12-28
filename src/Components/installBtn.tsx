const InstallBtn: React.FC = () => {
    return (
     <button id="installBtn" className='bg-green-700 rounded-full p-2' style={{ display: "none", position: "fixed", bottom: "20px", right: "20px" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
  <polyline points="7 10 12 15 17 10"/>
  <line x1="12" y1="15" x2="12" y2="3"/>
</svg></button>
    );

};
export default InstallBtn