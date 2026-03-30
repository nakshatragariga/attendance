import { useRef, useState, useEffect } from 'react';
import { Camera, UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';

export default function RegisterFace() {
    const [userId, setUserId] = useState('');
    const [users, setUsers] = useState([]);
    const [capturing, setCapturing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // 0 to 5 images
    const [capturedImages, setCapturedImages] = useState([]);
    const [status, setStatus] = useState('idle'); // idle, capturing, uploading, success
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await API.get('/auth/users');
                const studentList = res.data.filter(u => u.role === 'STUDENT');
                setUsers(studentList);
                if (studentList.length > 0) {
                    setUserId(studentList[0].id.toString());
                }
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        };

        fetchUsers();
        startCamera();
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const captureImage = () => {
        if (!userId) return alert('Please enter a User ID');

        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);

        canvasRef.current.toBlob((blob) => {
            const newImages = [...capturedImages, blob];
            setCapturedImages(newImages);
            setCurrentStep(prev => prev + 1);

            if (newImages.length === 5) {
                uploadImages(newImages);
            }
        }, 'image/jpeg');
    };

    const uploadImages = async (images) => {
        setStatus('uploading');
        const formData = new FormData();
        formData.append('userId', userId);
        images.forEach((blob, i) => {
            formData.append('images', blob, `face_${i}.jpg`);
        });

        try {
            await API.post('/face/register', formData);
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    const reset = () => {
        setCapturedImages([]);
        setCurrentStep(0);
        setStatus('idle');
        setUserId('');
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Register New Face</h1>
                <p>Enroll a user into the AI detection system by capturing 5 different angles.</p>
            </header>

            <div className="glass-panel" style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

                {/* Left Side: Setup */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Select User</label>
                        <select
                            className="glass-input"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            disabled={status !== 'idle'}
                        >
                            {users.length === 0 && <option value="">No users found</option>}
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} (ID: {user.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Capture Progress</h3>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <div key={s} style={{
                                    flex: 1,
                                    height: '6px',
                                    borderRadius: '3px',
                                    background: currentStep >= s ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s'
                                }} />
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {status === 'idle' && (
                                <motion.button
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="glass-button"
                                    style={{ width: '100%', height: '56px' }}
                                    onClick={captureImage}
                                >
                                    <Camera size={20} /> Capture Sample {currentStep + 1}/5
                                </motion.button>
                            )}
                            {status === 'uploading' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '12px' }}>
                                    <Loader2 className="animate-spin" style={{ margin: '0 auto 12px' }} />
                                    <p>Training AI Model...</p>
                                </motion.div>
                            )}
                            {status === 'success' && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    style={{ textAlign: 'center' }}
                                >
                                    <CheckCircle color="#10b981" size={48} style={{ margin: '0 auto 12px' }} />
                                    <p style={{ color: '#10b981', fontWeight: '600', marginBottom: '16px' }}>Training Complete!</p>
                                    <button className="glass-button" onClick={reset} style={{ width: '100%', background: 'rgba(255,255,255,0.1)' }}>Register Another</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side: Camera Preview */}
                <div style={{ position: 'relative' }}>
                    <div className="glass-panel" style={{
                        aspectRatio: '4/3',
                        overflow: 'hidden',
                        position: 'relative',
                        background: '#000',
                        borderRadius: '12px'
                    }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                        />

                        <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />

                        {/* Guide Overlay */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '60%',
                            height: '70%',
                            border: '2px dashed rgba(255,255,255,0.3)',
                            borderRadius: '50% / 40%',
                            pointerEvents: 'none'
                        }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', marginTop: '12px', textAlign: 'center' }}>
                        Position your face inside the dashed frame.
                    </p>
                </div>

            </div>
        </div>
    );
}
