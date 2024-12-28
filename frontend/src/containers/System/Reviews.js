import React from 'react'
require('./css/review.css')

const Reviews = () => {
  return (
    <div>
      <div className='review-bg'>
        <div className='w-full max-w-[1280px] px-8 py-4 m-auto'>
          <div className='flex justify-between gap-3 items-center'>
            <div className='flex gap-3'>
              <div className='fill-white stroke-[#475467]'>
                <a href='/admin/dashboard'><svg className='relative top-[-2px] fill-white stroke-[#475467]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 17H16M11.0177 2.76401L4.23539 8.03914C3.78202 8.39176 3.55534 8.56807 3.39203 8.78887C3.24737 8.98446 3.1396 9.2048 3.07403 9.43907C3 9.70353 3 9.99071 3 10.5651V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V10.5651C21 9.99071 21 9.70353 20.926 9.43907C20.8604 9.2048 20.7526 8.98446 20.608 8.78887C20.4447 8.56807 20.218 8.39176 19.7646 8.03914L12.9823 2.76401C12.631 2.49076 12.4553 2.35413 12.2613 2.30162C12.0902 2.25528 11.9098 2.25528 11.7387 2.30162C11.5447 2.35413 11.369 2.49076 11.0177 2.76401Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
              </div>
              <a href='/admin/review'>
                <div className='flex items-center gap-3'>
                  <svg className='w-4 h-4 stroke-[#d0d5dd]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  <div className='text-[#475467]'>Quản lý đánh giá</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className='w-full max-w-[1280px] px-8 py-4 m-auto'>
          <div className='container-review w-full py-8 px-4 flex flex-col gap-10'>
            <div className='text-[24px] font-semibold'>Quản lý đánh giá</div>
            <div className='grid grid-cols-4 gap-4'>
              <div class=" ">
                <label class="Input_input-group__6PMfq">
                  <input class="p-md" placeholder="Nhập họ và tên" readOnly name="name" value="Lê Đình Long" />
                  <label class="sm Input_required__eYDG_">Họ và tên</label>
                </label>
              </div>
              <div class=" ">
                <label class="Input_input-group__6PMfq">
                  <input class="p-md" placeholder="Nhập họ và tên" readOnly name="name" value="0705470780" />
                  <label class="sm Input_required__eYDG_">Số điện thoại</label>
                </label>
              </div>
              <div class=" ">
                <label class="Input_input-group__6PMfq">
                  <input class="p-md" placeholder="Nhập họ và tên" readOnly name="name" value="dinhlong366@gmail.com" />
                  <label class="sm Input_required__eYDG_">Địa chỉ email</label>
                </label>
              </div>
              <div class=" ">
                <label class="Input_input-group__6PMfq">
                  <input class="p-md" placeholder="Nhập họ và tên" readOnly name="name" value="Rất tốt" />
                  <label class="sm Input_required__eYDG_">Nội dung đánh giá</label>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reviews