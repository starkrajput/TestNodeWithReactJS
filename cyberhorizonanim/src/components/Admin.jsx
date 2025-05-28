import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    authService,
    getNews,
    createNews,
    updateNews,
    deleteNews,
    getNewsById,
    handleApiError
} from '../tools/newsService';
import gsap from 'gsap';
const Admin = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Breaking News',
        author: '',
        is_featured: false,
        is_highlight: false,
        image: null
    });
    const [previewImage, setPreviewImage] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Animation refs
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const tableRef = useRef(null);
    const modalRef = useRef(null);

    const categories = [
        'Breaking News',
        'Cyber Crime',
        'Corruption',
        'Tech Talk',
        'Fact Check',
        'Podcast'
    ];

    // GSAP Animation Effects
    useEffect(() => {
        // Initialize GSAP animations
        const initAnimations = () => {
            // Background animation
            const bgAnimation = document.querySelector('.animated-bg');
            if (bgAnimation) {
                // Animated gradient background
                gsap.to(bgAnimation, {
                    backgroundPosition: '200% 200%',
                    duration: 20,
                    repeat: -1,
                    ease: "none"
                });
            }

            // Header entrance animation
            if (headerRef.current) {
                gsap.fromTo(headerRef.current,
                    { y: -100, opacity: 0, rotationX: -90 },
                    { y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: "back.out(1.7)" }
                );
            }

            // Stagger table rows animation
            if (tableRef.current) {
                const rows = tableRef.current.querySelectorAll('tbody tr');
                gsap.fromTo(rows,
                    { x: -50, opacity: 0, rotationY: -15 },
                    { x: 0, opacity: 1, rotationY: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
                );
            }

            // Floating elements animation
            const floatingElements = document.querySelectorAll('.floating-element');
            floatingElements.forEach((element, index) => {
                gsap.to(element, {
                    y: "random(-20, 20)",
                    rotation: "random(-5, 5)",
                    duration: "random(2, 4)",
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: index * 0.2
                });
            });
        };

        // Load GSAP from CDN and initialize
        if (typeof gsap === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
            script.onload = initAnimations;
            document.head.appendChild(script);
        } else {
            initAnimations();
        }
    }, [news]);

    // Modal animation
    useEffect(() => {
        if (showModal && modalRef.current) {
            gsap.fromTo(modalRef.current,
                { scale: 0.5, opacity: 0, rotationY: -180 },
                { scale: 1, opacity: 1, rotationY: 0, duration: 0.8, ease: "back.out(1.7)" }
            );
        }
    }, [showModal]);

    // Check authentication and fetch news
    useEffect(() => {
        const checkAuthAndFetchNews = async () => {
            if (!authService.isAuthenticated()) {
                navigate('/login');
                return;
            }
            await fetchNews();
        };
        checkAuthAndFetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getNews();
            setNews(data || []);
        } catch (err) {
            console.error('Fetch news error:', err);
            const errorInfo = handleApiError(err);
            setError(errorInfo.message || 'Failed to fetch news. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
    };

    const handleAddNew = () => {
        setCurrentNews(null);
        setFormData({
            title: '',
            content: '',
            category: 'Breaking News',
            author: '',
            is_featured: false,
            is_highlight: false,
            image: null
        });
        setPreviewImage('');
        setError('');
        setShowModal(true);
    };

    const handleEdit = async (id) => {
        try {
            setError('');
            const newsItem = await getNewsById(id);
            setCurrentNews(newsItem);
            setFormData({
                title: newsItem.title || '',
                content: newsItem.content || '',
                category: newsItem.category || 'Breaking News',
                author: newsItem.author || '',
                is_featured: Boolean(newsItem.is_featured),
                is_highlight: Boolean(newsItem.is_highlight),
                image: null
            });
            setPreviewImage(newsItem.image || '');
            setShowModal(true);
        } catch (err) {
            console.error('Edit error:', err);
            const errorInfo = handleApiError(err);
            setError(errorInfo.message || 'Failed to load news item for editing.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            try {
                setError('');
                await deleteNews(id);
                setActionSuccess('News item deleted successfully!');
                await fetchNews();
                setTimeout(() => setActionSuccess(''), 3000);
            } catch (err) {
                console.error('Delete error:', err);
                const errorInfo = handleApiError(err);
                setError(errorInfo.message || 'Failed to delete news item.');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should not exceed 5MB.');
                return;
            }
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        if (!formData.title.trim() || !formData.content.trim()) {
            setError('Title and content are required.');
            setSubmitting(false);
            return;
        }

        try {
            let imageData = null;
            if (formData.image) {
                imageData = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(formData.image);
                });
            }

            const submitData = {
                title: formData.title.trim(),
                content: formData.content.trim(),
                category: formData.category,
                author: formData.author.trim() || null,
                is_featured: formData.is_featured,
                is_highlight: formData.is_highlight,
                image: imageData
            };

            let result;
            if (currentNews) {
                result = await updateNews(currentNews.id, submitData);
                setActionSuccess('News updated successfully!');
            } else {
                result = await createNews(submitData);
                setActionSuccess('News created successfully!');
            }

            console.log('Submit result:', result);
            setShowModal(false);
            await fetchNews();
            setTimeout(() => setActionSuccess(''), 3000);
        } catch (err) {
            console.error('Submit error:', err);
            const errorInfo = handleApiError(err);
            setError(errorInfo.message || 'Failed to save news. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    return (
        <div ref={containerRef} style={{
            minHeight: '100vh',
            background: 'linear-gradient(-45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
            backgroundSize: '400% 400%',
            position: 'relative',
            overflow: 'hidden',
            width:'100%'
        }} className="animated-bg">
            {/* Floating Geometric Shapes */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '100px',
                height: '100px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                transform: 'rotate(45deg)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
            }} className="floating-element"></div>

            <div style={{
                position: 'absolute',
                top: '20%',
                right: '10%',
                width: '80px',
                height: '80px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.3)'
            }} className="floating-element"></div>

            <div style={{
                position: 'absolute',
                bottom: '30%',
                left: '15%',
                width: '60px',
                height: '60px',
                background: 'rgba(255,255,255,0.1)',
                transform: 'rotate(30deg)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)'
            }} className="floating-element"></div>

            {/* Main Content */}
            <div style={{
                padding: '20px',
                fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Header */}
                    <div ref={headerRef} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '40px',
                        padding: '30px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '25px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
                        transform: 'perspective(1000px) rotateX(5deg)',
                        transformStyle: 'preserve-3d'
                    }}>
                        <div>
                            <h1 style={{
                                margin: 0,
                                color: '#ffffff',
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                letterSpacing: '-1px'
                            }}>
                                Admin Dashboard
                            </h1>
                            <p style={{
                                margin: '10px 0 0 0',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '1.2rem',
                                fontWeight: '500'
                            }}>
                                Manage your news content with style
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '15px 30px',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                boxShadow: '0 10px 25px rgba(238, 90, 82, 0.4)',
                                transform: 'translateZ(20px)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateZ(20px) translateY(-3px)';
                                e.target.style.boxShadow = '0 15px 35px rgba(238, 90, 82, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateZ(20px)';
                                e.target.style.boxShadow = '0 10px 25px rgba(238, 90, 82, 0.4)';
                            }}
                        >
                            Logout
                        </button>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div style={{
                            padding: '20px',
                            background: 'rgba(248, 215, 218, 0.9)',
                            color: '#721c24',
                            border: '1px solid rgba(245, 198, 203, 0.5)',
                            borderRadius: '15px',
                            marginBottom: '25px',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                            fontSize: '1.1rem',
                            fontWeight: '500'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Success Alert */}
                    {actionSuccess && (
                        <div style={{
                            padding: '20px',
                            background: 'rgba(212, 237, 218, 0.9)',
                            color: '#155724',
                            border: '1px solid rgba(195, 230, 203, 0.5)',
                            borderRadius: '15px',
                            marginBottom: '25px',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                            fontSize: '1.1rem',
                            fontWeight: '500'
                        }}>
                            {actionSuccess}
                        </div>
                    )}

                    {/* News Management Section */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(25px)',
                        padding: '35px',
                        borderRadius: '25px',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transform: 'perspective(1000px) rotateX(2deg)',
                        transformStyle: 'preserve-3d'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '30px'
                        }}>
                            <h2 style={{
                                margin: 0,
                                color: '#ffffff',
                                fontSize: '2.2rem',
                                fontWeight: 'bold',
                                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                            }}>
                                News Articles ({news.length})
                            </h2>
                            <button
                                onClick={handleAddNew}
                                style={{
                                    padding: '15px 30px',
                                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '15px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    boxShadow: '0 10px 25px rgba(79, 172, 254, 0.4)',
                                    transform: 'translateZ(20px)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateZ(20px) translateY(-3px)';
                                    e.target.style.boxShadow = '0 15px 35px rgba(79, 172, 254, 0.6)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateZ(20px)';
                                    e.target.style.boxShadow = '0 10px 25px rgba(79, 172, 254, 0.4)';
                                }}
                            >
                                ✨ Add New Article
                            </button>
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px',
                                color: '#ffffff',
                                fontSize: '1.3rem'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    border: '3px solid rgba(255,255,255,0.3)',
                                    borderTop: '3px solid #ffffff',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    margin: '0 auto 20px'
                                }}></div>
                                Loading news articles...
                            </div>
                        ) : news.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px',
                                color: 'rgba(255, 255, 255, 0.8)'
                            }}>
                                <h3 style={{ color: '#ffffff', fontSize: '1.8rem', marginBottom: '15px' }}>
                                    No articles found
                                </h3>
                                <p style={{ fontSize: '1.2rem' }}>Start by creating your first news article</p>
                            </div>
                        ) : (
                            /* News Table */
                            <div style={{ overflowX: 'auto' }} ref={tableRef}>
                                <table style={{
                                    width: '100%',
                                    borderCollapse: 'separate',
                                    borderSpacing: '0 10px'
                                }}>
                                    <thead>
                                        <tr>
                                            {['ID', 'Title', 'Category', 'Author', 'Date', 'Status', 'Actions'].map((header, index) => (
                                                <th key={header} style={{
                                                    padding: '20px',
                                                    textAlign: 'left',
                                                    background: 'rgba(255, 255, 255, 0.2)',
                                                    color: '#ffffff',
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'bold',
                                                    backdropFilter: 'blur(10px)',
                                                    borderRadius: index === 0 ? '15px 0 0 15px' : index === 6 ? '0 15px 15px 0' : '0',
                                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                                }}>
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {news.map((item, index) => (
                                            <tr key={item.id} style={{
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(15px)',
                                                borderRadius: '15px',
                                                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                transition: 'all 0.3s ease'
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                                                }}>
                                                <td style={{ padding: '20px', color: '#ffffff', fontSize: '1rem', fontWeight: '600' }}>
                                                    #{item.id}
                                                </td>
                                                <td style={{ padding: '20px' }}>
                                                    <div style={{
                                                        fontWeight: 'bold',
                                                        marginBottom: '8px',
                                                        color: '#ffffff',
                                                        fontSize: '1.1rem'
                                                    }}>
                                                        {item.title}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '0.95rem',
                                                        color: 'rgba(255, 255, 255, 0.7)',
                                                        lineHeight: '1.4'
                                                    }}>
                                                        {item.content.substring(0, 100)}...
                                                    </div>
                                                </td>
                                                <td style={{ padding: '20px' }}>
                                                    <span style={{
                                                        padding: '8px 16px',
                                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                                        color: 'white',
                                                        borderRadius: '20px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '600',
                                                        boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)'
                                                    }}>
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '20px', color: '#ffffff', fontSize: '1rem' }}>
                                                    {item.author || 'Anonymous'}
                                                </td>
                                                <td style={{ padding: '20px', fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                                                    {formatDate(item.published_date)}
                                                </td>
                                                <td style={{ padding: '20px' }}>
                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                        {item.is_featured && (
                                                            <span style={{
                                                                padding: '4px 12px',
                                                                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                                                color: 'white',
                                                                borderRadius: '12px',
                                                                fontSize: '0.8rem',
                                                                fontWeight: '600',
                                                                boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)'
                                                            }}>
                                                                Featured
                                                            </span>
                                                        )}
                                                        {item.is_highlight && (
                                                            <span style={{
                                                                padding: '4px 12px',
                                                                background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
                                                                color: '#333',
                                                                borderRadius: '12px',
                                                                fontSize: '0.8rem',
                                                                fontWeight: '600',
                                                                boxShadow: '0 4px 8px rgba(255, 193, 7, 0.3)'
                                                            }}>
                                                                Highlight
                                                            </span>
                                                        )}
                                                        {!item.is_featured && !item.is_highlight && (
                                                            <span style={{
                                                                fontSize: '0.9rem',
                                                                color: 'rgba(255, 255, 255, 0.6)',
                                                                fontStyle: 'italic'
                                                            }}>
                                                                Regular
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '20px' }}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button
                                                            onClick={() => handleEdit(item.id)}
                                                            style={{
                                                                padding: '8px 16px',
                                                                background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
                                                                color: '#333',
                                                                border: 'none',
                                                                borderRadius: '10px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.9rem',
                                                                fontWeight: '600',
                                                                boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.transform = 'translateY(-2px)';
                                                                e.target.style.boxShadow = '0 8px 20px rgba(255, 193, 7, 0.4)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.transform = 'translateY(0)';
                                                                e.target.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.3)';
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            style={{
                                                                padding: '8px 16px',
                                                                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '10px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.9rem',
                                                                fontWeight: '600',
                                                                boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.target.style.transform = 'translateY(-2px)';
                                                                e.target.style.boxShadow = '0 8px 20px rgba(220, 53, 69, 0.4)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.target.style.transform = 'translateY(0)';
                                                                e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '20px'
                }}>
                    <div ref={modalRef} style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(30px)',
                        borderRadius: '25px',
                        width: '90%',
                        maxWidth: '700px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                        transform: 'perspective(1000px) rotateX(5deg)',
                        transformStyle: 'preserve-3d'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '30px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '25px 25px 0 0'
                        }}>
                            <h3 style={{
                                margin: 0,
                                color: '#ffffff',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                            }}>
                                {currentNews ? '✏️ Edit Article' : '✨ Create New Article'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    fontSize: '1.8rem',
                                    cursor: 'pointer',
                                    width: '45px',
                                    height: '45px',
                                    borderRadius: '50%',
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                    e.target.style.transform = 'rotate(90deg)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                    e.target.style.transform = 'rotate(0deg)';
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '30px' }}>
                            <form onSubmit={handleSubmit}>
                                {/* Title */}
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '10px',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        fontSize: '1.1rem',
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    }}>
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '15px 20px',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: '15px',
                                            fontSize: '1rem',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)',
                                            color: '#ffffff',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder="Enter article title"
                                    />
                                </div>

                                {/* Category and Author Row */}
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '10px',
                                            fontWeight: 'bold',
                                            color: '#ffffff',
                                            fontSize: '1.1rem',
                                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                        }}>
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '15px 20px',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                borderRadius: '15px',
                                                fontSize: '1rem',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)',
                                                color: '#ffffff',
                                                boxSizing: 'border-box'
                                            }}
                                        >
                                            {categories.map(category => (
                                                <option key={category} value={category} style={{ background: '#333', color: '#fff' }}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '10px',
                                            fontWeight: 'bold',
                                            color: '#ffffff',
                                            fontSize: '1.1rem',
                                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                        }}>
                                            Author
                                        </label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            style={{
                                                width: '100%',
                                                padding: '15px 20px',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                borderRadius: '15px',
                                                fontSize: '1rem',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)',
                                                color: '#ffffff',
                                                boxSizing: 'border-box'
                                            }}
                                            placeholder="Author name"
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '10px',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        fontSize: '1.1rem',
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    }}>
                                        Content *
                                    </label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        required
                                        rows="8"
                                        style={{
                                            width: '100%',
                                            padding: '15px 20px',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: '15px',
                                            fontSize: '1rem',
                                            resize: 'vertical',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)',
                                            color: '#ffffff',
                                            boxSizing: 'border-box'
                                        }}
                                        placeholder="Write your article content here..."
                                    />
                                </div>

                                {/* Image */}
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '10px',
                                        fontWeight: 'bold',
                                        color: '#ffffff',
                                        fontSize: '1.1rem',
                                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                    }}>
                                        Featured Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{
                                            width: '100%',
                                            padding: '15px 20px',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: '15px',
                                            fontSize: '1rem',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)',
                                            color: '#ffffff',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    {previewImage && (
                                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: '250px',
                                                    maxHeight: '200px',
                                                    borderRadius: '15px',
                                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Checkboxes */}
                                <div style={{ display: 'flex', gap: '30px', marginBottom: '35px' }}>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: '#ffffff',
                                        fontSize: '1.1rem',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}>
                                        <input
                                            type="checkbox"
                                            name="is_featured"
                                            checked={formData.is_featured}
                                            onChange={handleInputChange}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                accentColor: '#4facfe'
                                            }}
                                        />
                                        🌟 Mark as Featured
                                    </label>
                                    <label style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: '#ffffff',
                                        fontSize: '1.1rem',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}>
                                        <input
                                            type="checkbox"
                                            name="is_highlight"
                                            checked={formData.is_highlight}
                                            onChange={handleInputChange}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                accentColor: '#ffc107'
                                            }}
                                        />
                                        ⚡ Mark as Highlight
                                    </label>
                                </div>

                                {/* Submit Buttons */}
                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            padding: '15px 30px',
                                            background: 'rgba(108, 117, 125, 0.8)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        disabled={submitting}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(108, 117, 125, 1)';
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(108, 117, 125, 0.8)';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '15px 30px',
                                            background: submitting
                                                ? 'rgba(79, 172, 254, 0.6)'
                                                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '15px',
                                            cursor: submitting ? 'not-allowed' : 'pointer',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            boxShadow: '0 10px 25px rgba(79, 172, 254, 0.4)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        disabled={submitting}
                                        onMouseEnter={(e) => {
                                            if (!submitting) {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 15px 35px rgba(79, 172, 254, 0.6)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!submitting) {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 10px 25px rgba(79, 172, 254, 0.4)';
                                            }
                                        }}
                                    >
                                        {submitting ? '⏳ Saving...' : (currentNews ? '💾 Update Article' : '🚀 Create Article')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                input::placeholder,
                textarea::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                }
                
                input:focus,
                textarea:focus,
                select:focus {
                    outline: none;
                    border: 2px solid rgba(79, 172, 254, 0.8) !important;
                    box-shadow: 0 0 20px rgba(79, 172, 254, 0.3) !important;
                }
                
                /* Responsive Design */
                @media (max-width: 768px) {
                    .animated-bg h1 {
                        font-size: 2rem !important;
                    }
                    
                    .animated-bg h2 {
                        font-size: 1.8rem !important;
                    }
                    
                    table {
                        font-size: 0.9rem;
                    }
                    
                    .floating-element {
                        display: none;
                    }
                }
                
                @media (max-width: 480px) {
                    .animated-bg h1 {
                        font-size: 1.8rem !important;
                    }
                    
                    .animated-bg h2 {
                        font-size: 1.5rem !important;
                    }
                    
                    table th,
                    table td {
                        padding: 12px 8px !important;
                        font-size: 0.8rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Admin;