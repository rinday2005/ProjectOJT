import React, { useState } from 'react';
import { appealApi, authApi } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { ShieldAlert, Send, LogOut, CheckCircle2 } from 'lucide-react';
import ScrollAnimation from '@/components/ui/scroll-animation';

const PRESET_REASONS = [
  'Tôi cho rằng tài khoản bị khóa do nhầm lẫn, tôi không vi phạm bất kỳ điều khoản nào.',
  'Tôi cam kết sẽ tuân thủ nghiêm túc các điều khoản sử dụng và chính sách của hệ thống.',
  'Tài khoản của tôi bị nghi ngờ đăng nhập trái phép, tôi cần mở khóa để cập nhật bảo mật.',
];

const BlockedPage = () => {
  const [appealMessage, setAppealMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealMessage.trim()) {
      toast.error('Vui lòng nhập nội dung khiếu nại!');
      return;
    }

    setSubmitting(true);
    try {
      await appealApi.submit(appealMessage);
      toast.success('Gửi khiếu nại thành công!');
      setSubmitted(true);
    } catch (error: any) {
      console.error('Failed to submit appeal', error);
      toast.error(error.response?.data?.message || 'Không thể gửi khiếu nại. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center font-['Public_Sans'] px-6 py-12 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-[#E0F2F1]/50 blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-red-50 blur-3xl -z-10" />

      <div className="w-full max-w-xl">
        <ScrollAnimation animation="fade-up">
          <div className="bg-white/85 backdrop-blur-xl border border-stone-150 shadow-2xl shadow-stone-200/50 rounded-[2.5rem] p-8 md:p-12 text-center space-y-8">

            {/* Alert Header Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-red-500 rounded-3xl shadow-inner animate-pulse">
              <ShieldAlert className="w-10 h-10" />
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">Tài Khoản Bị Tạm Khóa</h1>
              <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto">
                Tài khoản của bạn đã bị khóa do vi phạm các chính sách chung hoặc điều khoản sử dụng của hệ thống HomeCare.
              </p>
            </div>

            {/* Appeal Form or Success Message */}
            {!submitted ? (
              <form onSubmit={handleSubmitAppeal} className="space-y-6 text-left">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
                    Gửi yêu cầu khiếu nại tới Ban quản trị
                  </label>

                  {/* Preset appeal reason chips */}
                  <div className="flex flex-col gap-2 mb-2">
                    <span className="text-[10px] font-bold text-stone-500">Chọn lý do mẫu để điền nhanh:</span>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_REASONS.map((reason, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setAppealMessage(reason)}
                          className={`text-xs px-3 py-2 rounded-2xl border text-stone-600 transition-all font-medium text-left cursor-pointer hover:bg-stone-50 ${appealMessage === reason
                              ? 'bg-[#e0f2f1] text-[#2c7873] border-[#a2e8dd] font-semibold shadow-sm'
                              : 'bg-white border-stone-200 hover:border-[#5fa5ba]/50'
                            }`}
                        >
                          {index === 0 && '💡 Khóa do nhầm lẫn'}
                          {index === 1 && '🤝 Cam kết tuân thủ'}
                          {index === 2 && '🔒 Nghi ngờ bảo mật'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="Nhập lý do hoặc nội dung phản hồi của bạn để admin xem xét mở khóa tài khoản..."
                    value={appealMessage}
                    onChange={(e) => setAppealMessage(e.target.value)}
                    disabled={submitting}
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 p-4 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5fa5ba]/25 focus:border-[#5fa5ba] transition-all resize-none font-medium"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#5fa5ba] hover:bg-[#4d8ca0] text-white font-bold py-4 rounded-full shadow-xl shadow-[#5fa5ba]/25 hover:-translate-y-0.5 transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Gửi yêu cầu mở khóa</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <ScrollAnimation animation="scale-up">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 space-y-4 text-emerald-800 max-w-md mx-auto">
                  <div className="inline-flex text-emerald-500">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-stone-900">Khiếu nại đã được gửi!</h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Chúng tôi đã tiếp nhận phản hồi của bạn. Ban quản trị sẽ kiểm tra và phản hồi lại qua Email đăng ký của tài khoản trong thời gian sớm nhất.
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            )}

            {/* Divider */}
            <div className="border-t border-stone-100 pt-6 flex justify-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full font-bold text-xs transition-all uppercase tracking-wider"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>

          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default BlockedPage;
