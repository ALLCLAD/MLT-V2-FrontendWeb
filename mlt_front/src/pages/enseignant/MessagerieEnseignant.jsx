import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, GraduationCap, Loader2, ArrowLeft, Search } from 'lucide-react';
import api from '../../apiDjango/api.jsx';
import { ACCESS_TOKEN } from '../../apiDjango/constantes.jsx';

const MessagerieEnseignant = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const ws = useRef(null);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await api.get('/communication/contacts/');
                setContacts(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchContacts();
    }, []);

    useEffect(() => {
        if (!selectedContact) return;
        api.get(`/communication/messages/${selectedContact.id}/`).then(res => setMessages(res.data));
        const token = localStorage.getItem(ACCESS_TOKEN);
        ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${selectedContact.id}/?token=${token}`);
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, { id: Date.now(), expediteur: data.expediteur_id, contenu: data.message }]);
        };
        return () => { if (ws.current) ws.current.close(); };
    }, [selectedContact]);

    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim() || !ws.current) return;
        ws.current.send(JSON.stringify({ 'message': newMessage }));
        setNewMessage("");
    };

    return (
        <div className="flex h-[calc(100vh-160px)] bg-base-100 rounded-[2rem] border border-base-300 shadow-xl overflow-hidden animate-in slide-in-from-right-4 duration-500">
            {/* Sidebar Enseignant */}
            <div className={`w-full md:w-96 border-r border-base-200 flex flex-col bg-base-200/20 ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-8 bg-primary text-primary-content">
                    <h2 className="font-black text-2xl flex items-center gap-4">
                        <GraduationCap size={32} /> Ma Classe
                    </h2>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {loading ? <Loader2 className="animate-spin mx-auto mt-20" /> :
                     contacts.map(c => (
                        <div key={c.id} onClick={() => setSelectedContact(c)} className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedContact?.id === c.id ? 'bg-primary border-primary  shadow-xl translate-x-1' : ' border-base-300 hover:border-primary'}`}>
                            <p className="font-extrabold">{c.nom_complet || c.username}</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${selectedContact?.id === c.id ? '' : 'text-primary'}`}>{c.role}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Live Chat Enseignant */}
            <div className={`flex-grow flex flex-col  ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
                {selectedContact ? (
                    <>
                        <div className="p-6 border-b border-base-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedContact(null)} className="md:hidden"><ArrowLeft /></button>
                                <div className="font-black text-xl tracking-tight">{selectedContact.nom_complet || selectedContact.username}</div>
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto p-10 space-y-6 bg-base-200/10">
                            {messages.map(m => (
                                <div key={m.id} className={`flex ${m.expediteur === selectedContact.id ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] p-6 rounded-[2.5rem] font-bold text-[15px] shadow-sm ${m.expediteur === selectedContact.id ? 'bg-base-200 rounded-bl-none text-base-content' : 'bg-primary rounded-br-none text-white'}`}>
                                        {m.contenu}
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>
                        <div className="p-8 border-t border-base-200 flex gap-4">
                            <input type="text" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} onKeyPress={(e)=>e.key==='Enter'&&handleSend()} className="input input-bordered flex-grow h-14 rounded-2xl font-black bg-base-100" placeholder="Répondre..." />
                            <button onClick={handleSend} className="btn btn-primary h-14 w-14 rounded-2xl shadow-lg border-none"><Send size={24}/></button>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center grayscale opacity-20">
                        <MessageSquare size={150} strokeWidth={1} />
                        <h3 className="text-4xl font-black mt-8 uppercase tracking-tighter italic">Espace Messagerie</h3>
                    </div>
                )}
            </div>
        </div>
    );
};
export default MessagerieEnseignant;
