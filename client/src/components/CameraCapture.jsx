import { useRef, useState, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';

export default function CameraCapture() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [result, setResult] = useState(null); // { status: 'success' | 'error' | 'unknown', message: string }
    const [loading, setLoading] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraActive(true);
            setResult(null);
        } catch (err) {
            console.error('Camera error:', err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setResult({ status: 'error', message: "Camera permission denied. Please allow camera access in your browser settings." });
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setResult({ status: 'error', message: "No camera found. Please connect a camera and try again." });
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                setResult({ status: 'error', message: "Camera is in use by another application. Close other apps using the camera." });
            } else {
                setResult({ status: 'error', message: "Camera error: " + err.message });
            }
            setIsCameraActive(false);
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const captureAndVerify = () => {
        if (!isCameraActive) return;
        setLoading(true);
        setResult(null);

        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);

        canvasRef.current.toBlob(async (blob) => {
            const form = new FormData();
            form.append("image", blob, "capture.jpg");

            try {
                const res = await API.post("/face/verify", form);
                const data = res.data;
                const message = typeof data === 'string' ? data : data.message;

                if (message && message.toLowerCase().includes("recognized")) {
                    setResult({ status: 'success', message: message });
                } else {
                    setResult({ status: 'unknown', message: message || "Unknown response from server" });
                }
            } catch (err) {
                console.error('Capture Error:', err);
                const errorData = err.response?.data;
                let errorMsg = err.message;

                if (errorData) {
                    if (typeof errorData === 'string') {
                        errorMsg = errorData;
                    } else if (errorData.message) {
                        errorMsg = errorData.message;
                    } else if (errorData.error) {
                        errorMsg = errorData.error;
                    } else {
                        errorMsg = JSON.stringify(errorData);
                    }
                }

                if (err.code === 'ERR_NETWORK' || !err.response) {
                    setResult({ status: 'error', message: "Cannot reach server. Make sure the backend is running on port 8085." });
                } else {
                    setResult({ status: 'error', message: "Server error: " + errorMsg });
                }
            } finally {
                setLoading(false);
            }
        }, 'image/jpeg');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ position: 'relative' }}>
                <div className="glass-panel" style={{
                    aspectRatio: '4/3',
                    overflow: 'hidden',
                    background: '#000',
                    borderRadius: '16px'
                }}>
                    <video
                        ref={videoRef}
                        autoPlay
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                    />
                    <canvas ref={canvasRef} width="320" height="240" style={{ display: "none" }} />

                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <Loader2 className="animate-spin" size={40} color="white" />
                                    <p style={{ marginTop: '12px', fontSize: '0.875rem' }}>Analyzing Face...</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Control Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={captureAndVerify}
                    disabled={loading || !isCameraActive}
                    className="glass-button"
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '12px 32px',
                        boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)'
                    }}
                >
                    <Sparkles size={18} /> Mark Attendance
                </motion.button>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="glass-panel"
                        style={{ padding: '16px', borderLeft: `4px solid ${result.status === 'success' ? '#10b981' : '#f43f5e'}` }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {result.status === 'success' ? <CheckCircle color="#10b981" /> : <XCircle color="#f43f5e" />}
                            <p style={{ fontWeight: '500' }}>{result.message}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
