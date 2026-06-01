import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
 
const Dashboard = () => {
  const navigate = useNavigate();
  const user = userSelector (state => state.user);
    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate])
    return ( <div>Dashboard</div>
    )
}
export default Dashboard
