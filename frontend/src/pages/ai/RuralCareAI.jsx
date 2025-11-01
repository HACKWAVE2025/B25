export default function RuralCareAI(){
  const ref = new URLSearchParams(window.location.search).get('ref') || '';
  return <div style={{padding:16}}>RuralCare AI Module (patient: {ref})</div>;
}
