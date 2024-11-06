import React from 'react'
import logo from '../../assets/logo.webp'

export const Footer = () => {
    return (
        <div className='footer flex items-center justify-center'>
            <div className='footer-container flex gap-16 max-w-[1216px] pt-16 px-0 pb-12'>
                <div className='flex flex-col gap-5 max-w-[320px]'>
                    <a href='mixivivu.com'>
                        <img className='w-[220px] h-[60px]'
                            src={logo}
                            alt='mixivivu'
                        />
                    </a>
                    <label className='text-[#d0d5dd] font-medium'>
                        Công ty TNHH Du Lịch và Dịch Vụ Mixivivu
                        <br />
                        <br />
                        Tầng 7, số nhà 25, ngõ 38 phố Yên Lãng, phường Láng Hạ, quận Đống Đa, TP. Hà Nội
                        <br />
                        <br />
                        Mã số doanh nghiệp: 0110376372 do Sở Kế hoạch và Đầu tư Thành phố Hà Nội cấp ngày 05/06/2023
                    </label>
                </div>
                <div className='flex justify-between w-[896px] max-w-[900px]'>
                    <div class="flex flex-col gap-4">
                        <span class="text-[#667085] font-semibold text-[14px]">GIỚI THIỆU</span>
                        <div class="flex flex-col gap-3 text-[#98a2b3] font-bold text-base">
                            <a className='footer-hover' href="/ve-chung-toi" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Về chúng tôi</a>
                            <a className='footer-hover' href="/dieu-khoan-va-dieu-kien" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Điều khoản và điều kiện</a>
                            <a className='footer-hover' href="/chinh-sach-rieng-tu" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Chính sách riêng tư</a>
                            <a className='footer-hover' href="/huong-dan-su-dung" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Hướng dẫn sử dụng</a>
                            <a className='footer-hover' href="/hinh-thuc-thanh-toan" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Hình thức thanh toán</a>
                            <a className='footer-hover' href="/lien-he" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Liên hệ</a>
                            <a className='footer-hover' href="tel:0922222016" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Hotline: 0922222016</a>
                            <a className='footer-hover' href="mailto:info@mixivivu.com" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Email: info@mixivivu.com</a>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <span class="text-[#667085] font-semibold text-[14px]">ĐIỂM ĐẾN</span>
                        <div class="flex flex-col gap-3 text-[#98a2b3] font-bold text-base">
                            <a className='footer-hover' href="/ve-chung-toi" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Vịnh Hạ Long</a>
                            <a className='footer-hover' href="/dieu-khoan-va-dieu-kien" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Vịnh Lan Hạ</a>
                            <a className='footer-hover' href="/chinh-sach-rieng-tu" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Đảo Cát Bà
                            </a>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <span class="text-[#667085] font-semibold text-[14px]">DU THUYỀN</span>
                        <div class="flex flex-col gap-3 text-[#98a2b3] font-bold text-base">
                            <a className='footer-hover' href="/ve-chung-toi" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Blog</a>
                            <a className='footer-hover' href="/dieu-khoan-va-dieu-kien" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Quy định chung và lưu ý</a>
                            <a className='footer-hover' href="/chinh-sach-rieng-tu" class="subheading sm Footer_anchor__jQ0He" target="_blank" rel="noreferrer">Câu hỏi thường gặp</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
