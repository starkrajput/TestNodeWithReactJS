import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { authService, checkServerHealth, handleApiError } from '../tools/newsService';
import '../styles/login.css'; // This will contain our new styles
import { gsap } from 'gsap'; // Import GSAP core
import { CSSPlugin } from 'gsap/CSSPlugin'; // For older versions, or if experiencing issues with transforms

// Register CSSPlugin (optional, but good practice if experiencing issues)
gsap.registerPlugin(CSSPlugin);

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverStatus, setServerStatus] = useState('checking');
    const navigate = useNavigate();

    // Refs for GSAP animations
    const loginContainerRef = useRef(null);
    const formRef = useRef(null);
    const titleRef = useRef(null);
    const serverStatusRef = useRef(null);
    const usernameInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const loginButtonRef = useRef(null);
    const defaultCredsRef = useRef(null);
    const offlineAlertRef = useRef(null);

    // --- Server Health Check & Initial Authentication ---
    useEffect(() => {
        const checkServer = async () => {
            try {
                await checkServerHealth();
                setServerStatus('online');
            } catch (err) {
                console.error('Server health check failed:', err);
                setServerStatus('offline');
                setError('Unable to connect to server. Please ensure the backend is running on port 5000.');
            }
        };

        checkServer();
    }, []);

    useEffect(() => {
        if (authService.isAuthenticated()) {
            navigate('/admin');
        }
    }, [navigate]);

    // --- GSAP Animations ---
    useEffect(() => {
        // Initial Page Load Animation
        gsap.fromTo(loginContainerRef.current,
            { opacity: 0, scale: 0.9, y: 50, rotationY: 20, rotationX: 10 },
            { opacity: 1, scale: 1, y: 0, rotationY: 0, rotationX: 0, duration: 1.2, ease: "power3.out", delay: 0.3 }
        );

        // Title and Server Status Reveal
        gsap.fromTo([titleRef.current, serverStatusRef.current],
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.2, delay: 0.8 }
        );

        // Form elements animation (staggered)
        gsap.fromTo(
            [usernameInputRef.current, passwordInputRef.current, loginButtonRef.current, defaultCredsRef.current],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.15, delay: 1.2 }
        );

        // Optional: Animate error alert when it appears
        if (error) {
            gsap.fromTo(".alert-danger",
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
            );
        }

        // Optional: Animate offline alert when it appears
        if (serverStatus === 'offline' && offlineAlertRef.current) {
            gsap.fromTo(offlineAlertRef.current,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }
            );
        }

    }, [error, serverStatus]); // Re-run animations for error/server status changes


    // --- Form Submission & Handlers (existing functionality) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username.trim()) {
            setError('Username is required');
            setLoading(false);
            return;
        }

        if (!password) {
            setError('Password is required');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.login(username.trim(), password);
            console.log('Login response:', response);

            if (response.success) {
                navigate('/admin');
            } else {
                setError(response.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login failed:', err);
            const errorInfo = handleApiError(err);

            if (errorInfo.status === 401) {
                setError('Invalid username or password. Please try again.');
            } else if (errorInfo.status === 0) {
                setError('Cannot connect to server. Please check if the backend is running.');
                setServerStatus('offline');
            } else {
                setError(errorInfo.message || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        if (error) setError('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError('');
    };

    const getServerStatusColor = () => {
        switch (serverStatus) {
            case 'online': return 'text-success'; // Use Bootstrap text utility class
            case 'offline': return 'text-danger';
            default: return 'text-warning';
        }
    };

    const getServerStatusText = () => {
        switch (serverStatus) {
            case 'online': return 'Server Online';
            case 'offline': return 'Server Offline';
            default: return 'Checking Server...';
        }
    };

    return (
        <div className="login-page-wrapper"> {/* Global wrapper for background */}
            <div className="background-animation"></div> {/* GSAP-controlled background */}

            <Container className="login-container">
                <Row className="justify-content-center">
                    <Col md={7} lg={6} xl={5}> {/* Adjusted column sizes for larger forms */}
                        <div className="login-form-card" ref={loginContainerRef}> {/* Card with 3D animation */}
                            <div className="text-center mb-5"> {/* Increased margin */}
                                <h2 className="login-title" ref={titleRef}>Admin Login</h2>
                                <small className={`server-status-text ${getServerStatusColor()}`} ref={serverStatusRef}>
                                    {serverStatus === 'checking' && <Spinner size="sm" className="me-1" />}
                                    {getServerStatusText()}
                                </small>
                            </div>

                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4 animated-alert">
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit} ref={formRef}>
                                <Form.Group className="mb-4"> {/* Increased margin */}
                                    <Form.Label className="form-label-custom">Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={handleUsernameChange}
                                        required
                                        placeholder="Enter username"
                                        autoComplete="username"
                                        disabled={loading || serverStatus === 'offline'}
                                        className="form-control-custom"
                                        ref={usernameInputRef}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4"> {/* Increased margin */}
                                    <Form.Label className="form-label-custom">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                        placeholder="Enter password"
                                        autoComplete="current-password"
                                        disabled={loading || serverStatus === 'offline'}
                                        className="form-control-custom"
                                        ref={passwordInputRef}
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 login-button-custom"
                                    disabled={loading || serverStatus === 'offline'}
                                    ref={loginButtonRef}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size="sm" animation="border" className="me-2" />
                                            Logging in...
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </Button>
                            </Form>

                            <div className="mt-5 text-center" ref={defaultCredsRef}> {/* Increased margin */}
                                <div className="text-muted default-creds-text">
                                    <small>Default credentials:</small>
                                </div>
                                <div className="mt-2"> {/* Increased margin */}
                                    <kbd className="cred-kbd">cyberadmin</kbd> / <kbd className="cred-kbd">Test@123</kbd>
                                </div>
                            </div>

                            {serverStatus === 'offline' && (
                                <div className="mt-5 text-center" ref={offlineAlertRef}> {/* Increased margin */}
                                    <Alert variant="warning" className="small server-offline-alert">
                                        <strong>Backend Not Running?</strong><br />
                                        Make sure your Express server is running on port 5000.
                                        <br />
                                        <code>npm run server</code> or <code>node server.js</code>
                                    </Alert>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;