import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const FormulaireAdulte = ({ formData, handleChange, handleSubmit, loading, backendErrors }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [localErrors, setLocalErrors] = useState({});

    const inputStyle = `w-full h-14 px-4 rounded-2xl font-medium bg-base-200 border-2 border-base-300 focus:outline-none focus:border-primary text-base-content transition-all no-native-eye`;

    // PRIORITÉ : Erreur Django (backend) d'abord, sinon Erreur Locale
    const getErrorMessage = (fieldName) => {
        if (backendErrors && backendErrors[fieldName]) {
            return Array.isArray(backendErrors[fieldName]) ? backendErrors[fieldName][0] : backendErrors[fieldName];
        }
        return localErrors[fieldName] || null;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let msg = "";
        if (name === "email" && value && !/^[a-zA-Z0-9.]+@gmail\.com$/.test(value)) {
            msg = "Format: prenomnom@gmail.com";
        }
        if (name === "password" && value && value.length < 8) {
            msg = "8 caractères minimum.";
        }
        setLocalErrors(prev => ({ ...prev, [name]: msg }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // On laisse handleSubmit gérer l'envoi et la réception des erreurs Django
        handleSubmit();
    };

    return (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            <style>{`.no-native-eye::-ms-reveal { display: none; }`}</style>

            {/* RÔLES */}
            <div className="w-full">
                <label className="block text-[10px] font-bold uppercase opacity-50 mb-3 tracking-wider">Je m'inscris en tant que :</label>
                <div className="grid grid-cols-2 gap-4">
                    {['PARENT', 'ENSEIGNANT'].map((role) => (
                        <label key={role} className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.role === role ? "border-primary bg-primary/5" : "border-base-300 bg-base-200"}`}>
                            <input type="radio" name="role" value={role} checked={formData.role === role} onChange={handleChange} className="radio radio-primary radio-xs" />
                            <span className={`font-bold text-xs ${formData.role === role ? "text-primary" : "opacity-40"}`}>{role}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* PRÉNOM / NOM */}
            <div className="grid grid-cols-2 gap-4">
                <input type="text" name="first_name" value={formData.first_name} placeholder="Prénom" onChange={handleChange} className={inputStyle} required />
                <input type="text" name="last_name" value={formData.last_name} placeholder="Nom" onChange={handleChange} className={inputStyle} required />
            </div>

            {/* USERNAME */}
            <div className="flex flex-col gap-1">
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    placeholder="Nom d'utilisateur"
                    onChange={handleChange}
                    className={`${inputStyle} ${getErrorMessage('username') ? "border-error" : ""}`}
                    required
                />
                {getErrorMessage('username') && (
                    <p className="text-error text-[10px] font-bold mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-left-1">
                        <AlertCircle size={12}/> {getErrorMessage('username')}
                    </p>
                )}
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-1">
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    placeholder="prenomnom@gmail.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputStyle} ${getErrorMessage('email') ? "border-error" : ""}`}
                    required
                />
                {getErrorMessage('email') && (
                    <p className="text-error text-[10px] font-bold mt-1 flex items-center gap-1 animate-in fade-in slide-in-from-left-1">
                        <AlertCircle size={12}/> {getErrorMessage('email')}
                    </p>
                )}
            </div>

            {/* CHAMPS ENSEIGNANT */}
            {formData.role === "ENSEIGNANT" && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    <input type="text" name="etablissement_inscription" value={formData.etablissement_inscription} placeholder="Établissement" onChange={handleChange} className={inputStyle} required />
                    <select name="classe_enseignement_inscription" value={formData.classe_enseignement_inscription} onChange={handleChange} className={`${inputStyle} font-bold text-primary`}>
                        {['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            )}

            {/* PASSWORD */}
            <div className="flex flex-col gap-1">
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        placeholder="Mot de passe"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${inputStyle} pr-14 ${getErrorMessage('password') ? "border-error" : ""}`}
                        required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-base-content/30 hover:text-primary transition-colors">
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 px-2">
                    <Rule label="8+ car." active={formData.password?.length >= 8} />
                    <Rule label="Maj" active={/[A-Z]/.test(formData.password)} />
                    <Rule label="Chiffre" active={/[0-9]/.test(formData.password)} />
                </div>
                {getErrorMessage('password') && (
                    <p className="text-error text-[10px] font-bold mt-1 flex items-center gap-1"><AlertCircle size={12}/> {getErrorMessage('password')}</p>
                )}
            </div>

            {/* CONFIRMATION */}
            <div className="flex flex-col gap-1">
                <div className="relative">
                    <input
                        type={showConfirm ? "text" : "password"}
                        name="password_confirm"
                        value={formData.password_confirm}
                        placeholder="Confirmer"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`${inputStyle} pr-14 ${getErrorMessage('password_confirm') ? "border-error" : ""}`}
                        required
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-base-content/30 hover:text-primary transition-colors">
                        {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                </div>
                {getErrorMessage('password_confirm') && (
                    <p className="text-error text-[10px] font-bold mt-1 flex items-center gap-1"><AlertCircle size={12}/> {getErrorMessage('password_confirm')}</p>
                )}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full h-16 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.01] active:scale-95 transition-all">
                {loading ? <span className="loading loading-spinner"></span> : "CRÉER MON COMPTE"}
            </button>
        </form>
    );
};

const Rule = ({ label, active }) => (
    <div className={`flex items-center gap-1 transition-opacity ${active ? "text-success opacity-100" : "opacity-20"}`}>
        <CheckCircle2 size={10} />
        <span className="text-[9px] font-bold uppercase">{label}</span>
    </div>
);

export default FormulaireAdulte;