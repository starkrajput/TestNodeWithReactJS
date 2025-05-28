import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getNewsById, convertImageBufferToUrl } from '../tools/newsService';
import '../styles/ArticleDetail.css';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await getNewsById(id);

                // Process image if available
                let imageUrl = null;
                if (data.image) {
                    imageUrl = convertImageBufferToUrl(data.image);
                }

                setArticle({ ...data, imageUrl });
            } catch (err) {
                console.error('Error fetching article:', err);
                setError('Failed to load the article. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchArticle();
        }
    }, [id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            <Navbar />
            <div className="article-container">
                {loading ? (
                    <div className="loading-spinner">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : article ? (
                    <>
                        <div className="article-header">
                            <div className="article-category">{article.category}</div>
                            <h1 className="article-title">{article.title}</h1>
                            <div className="article-meta">
                                <span className="article-date">{formatDate(article.created_at)}</span>
                            </div>
                        </div>

                        {article.imageUrl && (
                            <div className="article-image">
                                <img src={article.imageUrl} alt={article.title} />
                            </div>
                        )}

                        <div className="article-description">
                            <p>{article.description}</p>
                        </div>

                        <div
                            className="article-content"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {article.tags && (
                            <div className="article-tags">
                                <h4>Tags:</h4>
                                <div className="tags-list">
                                    {article.tags.split(',').map((tag, index) => (
                                        <span className="tag" key={index}>{tag.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="article-navigation">
                            <Link to={`/${article.category.toLowerCase().replace(/\s+/g, '-')}`} className="back-to-category">
                                Back to {article.category}
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="not-found-message">Article not found</div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ArticleDetail;