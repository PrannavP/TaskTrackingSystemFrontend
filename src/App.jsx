import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "../src/pages/Auth/LoginPage";
import RegisterPage from "../src/pages/Auth/RegisterPage";
import ForgotPasswordPage from "../src/pages/Auth/ForgotPasswordPage";
import DashboardPage from "../src/pages/Dashboard/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TaskListPage from "./pages/Tasks/TaskListPage";
import TaskFormPage from "./pages/Tasks/TaskFormPage";
import TaskViewPage from "./pages/Tasks/TaskViewPage";
import ProfilePage from "./pages/Profile/Profile";
import NotFoundPage from "./pages/NotFountPage";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                {/* unprotected route */}
                <Route path="/login" element={<AuthLayout />}>
                    <Route index element={<LoginPage />} />
                </Route>

                <Route path="/register" element={<AuthLayout />}>
                    <Route index element={<RegisterPage />} />
                </Route>

                <Route path="/forgot-password" element={<AuthLayout />}>
                    <Route index element={<ForgotPasswordPage />} />
                </Route>

                {/* protected route */}
                <Route path="/" element={<ProtectedRoute />}>
                    <Route element={<RootLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="tasks" element={<RootLayout />} >
                            <Route index element={<TaskListPage />} />
                            <Route path="edit/:id" element={<TaskFormPage />} />
                            <Route path="add/" element={<TaskFormPage />} />
                            <Route path="view/:id" element={<TaskViewPage />} />
                        </Route>
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </>
        )
    );

    return(
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
};

export default App;