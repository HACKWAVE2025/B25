import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminHome from './pages/admin/AdminHome';
import Hospitals from './pages/admin/Hospitals';
import OwnerHome from './pages/owner/OwnerHome';
import Staff from './pages/owner/Staff';
import NurseHome from './pages/nurse/NurseHome';
import Patients from './pages/nurse/Patients';
import NurseConsults from './pages/nurse/NurseConsults';
import DoctorHome from './pages/doctor/DoctorHome';
import DoctorQueue from './pages/doctor/DoctorQueue';
import PrescriptionEditor from './pages/doctor/PrescriptionEditor';
import InProgress from './pages/doctor/InProgress';
import ConsultationDetails from './pages/doctor/ConsultationDetails';
import PrescriptionView from './pages/nurse/PrescriptionView';
import EditPatient from './pages/nurse/EditPatient';
import VideoCall from './pages/common/VideoCall';


function PrivateRoute({ children, roles }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={['admin']}>
            <AdminHome />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/hospitals"
        element={
          <PrivateRoute roles={['admin']}>
            <Hospitals />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route
      path="/owner"
      element={
        <PrivateRoute roles={['hospital_owner']}>
          <OwnerHome />
        </PrivateRoute>
      }
    />
   <Route
     path="/owner/staff"
     element={
       <PrivateRoute roles={['hospital_owner']}>
         <Staff />
       </PrivateRoute>
     }
   />
   <Route
  path="/nurse"
  element={
    <PrivateRoute roles={['nurse']}>
      <NurseHome />
    </PrivateRoute>
  }
/>
<Route
  path="/nurse/patients"
  element={
    <PrivateRoute roles={['nurse']}>
      <Patients />
    </PrivateRoute>
  }
/>
<Route
  path="/nurse/consultations"
  element={
    <PrivateRoute roles={['nurse']}>
      <NurseConsults />
    </PrivateRoute>
  }
/>
<Route
  path="/doctor"
  element={
    <PrivateRoute roles={['doctor']}>
      <DoctorHome />
    </PrivateRoute>
  }
/>
<Route
  path="/doctor/queue"
  element={
    <PrivateRoute roles={['doctor']}>
      <DoctorQueue />
    </PrivateRoute>
  }
/>
<Route
  path="/doctor/in-progress"
  element={
    <PrivateRoute roles={['doctor']}>
      <InProgress />
    </PrivateRoute>
  }
/>
  <Route
  path="/doctor/prescription"
  element={
    <PrivateRoute roles={['doctor']}>
      <PrescriptionEditor />
    </PrivateRoute>
  }
/>
    <Route
  path="/doctor/consultations/:id"
  element={
    <PrivateRoute roles={['doctor']}>
      <ConsultationDetails />
    </PrivateRoute>
  }
/>
<Route
  path="/nurse/prescription"
  element={
    <PrivateRoute roles={['nurse']}>
      <PrescriptionView />
    </PrivateRoute>
  }
/>
<Route
  path="/nurse/patient/edit"
  element={
    <PrivateRoute roles={['nurse']}>
      <EditPatient />
    </PrivateRoute>
  }
/>
<Route
  path="/video"
  element={
    <PrivateRoute roles={['nurse','doctor']}>
      <VideoCall />
    </PrivateRoute>
  }
/>

    </Routes>
  );
}

