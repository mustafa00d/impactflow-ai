import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { useApp } from './context/AppContext'
import Admin from './pages/Admin'
import AiCenter from './pages/AiCenter'
import Beneficiaries from './pages/Beneficiaries'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import Finance from './pages/Finance'
import Login from './pages/Login'
import Projects from './pages/Projects'
import PublicShare from './pages/PublicShare'
import Reports from './pages/Reports'

export default function App() {
  const { authenticated } = useApp()
  return <Routes>
    <Route path="/share/:token" element={<PublicShare/>}/>
    <Route path="/login" element={authenticated ? <Navigate to="/" replace/> : <Login/>}/>
    <Route element={authenticated ? <Layout/> : <Navigate to="/login" replace/>}>
      <Route index element={<Dashboard/>}/>
      <Route path="projects" element={<Projects/>}/>
      <Route path="reports" element={<Reports/>}/>
      <Route path="finance" element={<Finance/>}/>
      <Route path="beneficiaries" element={<Beneficiaries/>}/>
      <Route path="documents" element={<Documents/>}/>
      <Route path="ai" element={<AiCenter/>}/>
      <Route path="admin" element={<Admin/>}/>
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>
}
