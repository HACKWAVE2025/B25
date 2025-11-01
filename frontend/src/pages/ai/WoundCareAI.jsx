export default function WoundCareAI(){
  const ref = new URLSearchParams(window.location.search).get('ref') || '';
  return <div style={{padding:16}}>WoundCare AI Module (patient: {ref})</div>;
}
