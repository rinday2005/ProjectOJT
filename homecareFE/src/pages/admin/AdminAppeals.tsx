import React, { useState, useEffect } from 'react';
import { appealApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import ScrollAnimation from '@/components/ui/scroll-animation';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Mail, Eye } from 'lucide-react';

const STATIC_TEMPLATES = [
  {
    title: 'Vi phạm điều khoản (Không mở)',
    content: 'Chào bạn,\n\nSau khi kiểm tra, chúng tôi nhận thấy tài khoản của bạn đã vi phạm nghiêm trọng điều khoản sử dụng của hệ thống HomeCare. Do đó, tài khoản này sẽ tiếp tục bị khóa và không được mở lại.\n\nTrân trọng,\nBan quản trị HomeCare System.'
  },
  {
    title: 'Yêu cầu mở khóa thành công',
    content: 'Chào bạn,\n\nYêu cầu khiếu nại của bạn đã được phê duyệt. Ban quản trị đã mở khóa tài khoản của bạn. Vui lòng đăng nhập lại hệ thống.\n\nTrân trọng,\nBan quản trị HomeCare System.'
  },
  {
    title: 'Khóa để xác minh giao dịch',
    content: 'Chào bạn,\n\nTài khoản của bạn tạm thời bị khóa để xác minh một số giao dịch nghi vấn phát sinh gần đây. Chúng tôi sẽ sớm liên hệ trực tiếp với bạn qua điện thoại để hỗ trợ giải quyết.\n\nTrân trọng,\nBan quản trị HomeCare System.'
  }
];

const AdminAppeals = () => {
  const [appeals, setAppeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppeal, setSelectedAppeal] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const data = await appealApi.getAll();
      setAppeals(data || []);
    } catch (error) {
      console.error('Failed to load appeals', error);
      toast.error('Không thể tải danh sách khiếu nại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppeals();
  }, []);

  const handleOpenReplyModal = (appeal: any) => {
    setSelectedAppeal(appeal);
    setReplyText('');
  };

  const handleApplyTemplate = (content: string) => {
    setReplyText(content);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi!');
      return;
    }

    setSending(true);
    try {
      await appealApi.reply(selectedAppeal.id, replyText);
      toast.success('Gửi phản hồi thành công và email đã được gửi đi!');
      setSelectedAppeal(null);
      setReplyText('');
      fetchAppeals();
    } catch (error: any) {
      console.error('Failed to reply to appeal', error);
      toast.error(error.response?.data?.message || 'Không thể gửi phản hồi');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 font-['Public_Sans'] px-6 py-6 animate-fade-in-up">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Quản Lý Khiếu Nại Tài Khoản</h1>
        <p className="text-stone-500 font-medium">Xem và giải quyết các khiếu nại tài khoản bị tạm khóa từ người dùng</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-12 h-12 border-4 border-[#0d8ca5] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-stone-500 font-medium">Đang tải danh sách khiếu nại...</p>
        </div>
      ) : appeals.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-stone-100 shadow-sm">
          <MessageSquare className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 font-bold text-lg">Không có khiếu nại nào cần giải quyết</p>
          <p className="text-stone-400 text-xs mt-1">Các yêu cầu khiếu nại tài khoản bị khóa sẽ hiển thị tại đây.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100 text-[10px] font-black uppercase tracking-wider text-stone-400">
                  <th className="p-6">ID</th>
                  <th className="p-6">Tài Khoản Khiếu Nại</th>
                  <th className="p-6">Nội Dung Khiếu Nại</th>
                  <th className="p-6">Ngày Gửi</th>
                  <th className="p-6">Trạng Thái</th>
                  <th className="p-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm font-semibold text-stone-700">
                {appeals.map((appeal) => (
                  <tr key={appeal.id} className="hover:bg-stone-50/30 transition-colors">
                    <td className="p-6">#{appeal.id}</td>
                    <td className="p-6">
                      <p className="text-stone-900 font-bold">{appeal.userFullName || 'N/A'}</p>
                      <p className="text-xs text-stone-400 font-medium flex items-center gap-1 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-stone-300" />
                        {appeal.email}
                      </p>
                    </td>
                    <td className="p-6 max-w-sm">
                      <p className="text-stone-600 line-clamp-2 leading-relaxed">{appeal.message}</p>
                    </td>
                    <td className="p-6 text-stone-500 font-medium">
                      {new Date(appeal.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-6">
                      <span className={`px-2.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-max ${
                        appeal.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {appeal.status === 'PENDING' ? (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            Đợi Phản Hồi
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đã Trả Lời
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      {appeal.status === 'PENDING' ? (
                        <button
                          onClick={() => handleOpenReplyModal(appeal)}
                          className="px-4 py-2 bg-[#0d8ca5] hover:bg-[#0a7d94] text-white rounded-xl text-xs transition-all font-bold shadow-sm shadow-[#0d8ca5]/10 flex items-center gap-1.5 ml-auto"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Phản Hồi
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenReplyModal(appeal)}
                          className="px-4 py-2 bg-stone-50 border border-stone-200 text-stone-600 hover:bg-stone-100 rounded-xl text-xs transition-all font-bold flex items-center gap-1.5 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Xem chi tiết
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {selectedAppeal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-stone-100 max-w-2xl w-full shadow-2xl p-8 space-y-6 animate-scale-in">
            <div className="flex justify-between items-start border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-stone-900 tracking-tight">Phản hồi khiếu nại tài khoản</h3>
                <p className="text-xs text-stone-400 font-medium mt-1">Khiếu nại từ {selectedAppeal.userFullName} ({selectedAppeal.email})</p>
              </div>
              <button
                onClick={() => setSelectedAppeal(null)}
                className="text-stone-400 hover:text-stone-600 font-black text-lg"
              >
                &times;
              </button>
            </div>

            {/* Appeal Message content */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-150 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">Nội dung khiếu nại</span>
              <p className="text-sm text-stone-700 leading-relaxed font-medium whitespace-pre-wrap">{selectedAppeal.message}</p>
            </div>

            {/* Predefined Templates (static reply options) */}
            {selectedAppeal.status === 'PENDING' && (
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">Chọn mẫu nội dung phản hồi</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {STATIC_TEMPLATES.map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl.content)}
                      className="p-3 text-left text-xs bg-stone-50/50 hover:bg-[#0d8ca5]/5 border border-stone-200 hover:border-[#0d8ca5] rounded-xl font-bold text-stone-700 hover:text-[#0d8ca5] transition-all"
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400">Nội dung phản hồi (Sẽ gửi email về cho user)</label>
                <textarea
                  rows={6}
                  value={selectedAppeal.status === 'PENDING' ? replyText : selectedAppeal.replyContent}
                  onChange={(e) => setReplyText(e.target.value)}
                  readOnly={selectedAppeal.status !== 'PENDING'}
                  placeholder="Nhập nội dung thư phản hồi hoặc chọn mẫu bên trên..."
                  className="w-full rounded-2xl border border-stone-200 p-4 text-sm text-stone-850 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0d8ca5]/25 focus:border-[#0d8ca5] transition-all resize-none font-medium bg-stone-50/30"
                  required
                />
              </div>

              {selectedAppeal.status === 'PENDING' ? (
                <div className="flex gap-4 justify-end pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setSelectedAppeal(null)}
                    className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full font-bold text-xs transition-all uppercase tracking-wider"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-6 py-3 bg-[#0d8ca5] hover:bg-[#0a7d94] text-white rounded-full font-bold text-xs transition-all uppercase tracking-wider shadow-lg shadow-[#0d8ca5]/10 flex items-center gap-1.5"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Gửi phản hồi</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex justify-end pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setSelectedAppeal(null)}
                    className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full font-bold text-xs transition-all uppercase tracking-wider"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminAppeals;
