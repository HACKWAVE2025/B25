export default function SkinCareAI(){
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref') || '';
  return <div style={{padding:16}}>SkinCare AI Module (patient: {ref})</div>;
}
