"use client";
import React, { useRef, useState } from "react";

const task = {
  title: "Nộp báo cáo tiến độ tuần 1",
  description:
    "Các thành viên cần hoàn thành báo cáo tiến độ tuần 1, bao gồm các nội dung:\n- Tóm tắt công việc đã làm\n- Gặp khó khăn gì\n- Đề xuất hỗ trợ nếu có",
  deadline: "2024-06-30 23:59",
};

const submissionsSample = [
  {
    time: "2024-06-20 20:15",
    status: "Đã chấm",
    score: 9,
    comment: "Báo cáo tốt, cần bổ sung thêm hình ảnh minh hoạ.",
    files: ["baocao_tuan1.pdf"],
  },
  {
    time: "2024-06-18 21:00",
    status: "Chưa chấm",
    score: null,
    comment: null,
    files: ["baocao_tuan1_v1.pdf"],
  },
];

export default function Page() {
  const [submissions, setSubmissions] = useState(submissionsSample);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    setSubmissions([
      {
        time: new Date().toLocaleString("vi-VN"),
        status: "Chưa chấm",
        score: null,
        comment: null,
        files: selectedFiles.map((f) => f.name),
      },
      ...submissions,
    ]);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #fff 100%)',
      padding: '40px 0',
    }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 32,
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 24px #b6b6e633',
        position: 'relative',
      }}>
        {/* Tiêu đề và deadline */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ marginRight: 12, display: 'flex', alignItems: 'center' }}>
            {/* icon nhiệm vụ */}
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#6366f1"/><path d="M8 12.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#3730a3', margin: 0 }}>{task.title}</h1>
        </div>
        <div style={{ color: '#6366f1', fontWeight: 600, marginBottom: 18, display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{marginRight: 6}}><path d="M12 8v4l3 1" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2"/></svg>
          Deadline: <span style={{marginLeft: 4}}>{task.deadline}</span>
        </div>
        {/* Mô tả nhiệm vụ */}
        <div style={{ marginBottom: 28, background: '#f1f5f9', borderRadius: 8, padding: 16, color: '#334155', fontSize: 16, whiteSpace: 'pre-line' }}>
          {task.description}
        </div>

        {/* Khu vực nộp bài */}
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12, color: '#3730a3', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{marginRight: 6}}><path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="16" width="16" height="4" rx="2" fill="#6366f1" opacity=".1"/></svg>
            Nộp bài
          </h2>
          <label
            htmlFor="file-upload"
            style={{
              display: 'block',
              border: '2px dashed #a5b4fc',
              borderRadius: 10,
              padding: '28px 0',
              textAlign: 'center',
              background: '#f8fafc',
              color: '#6366f1',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: 10,
              transition: 'border 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.border = '2px solid #6366f1')}
            onMouseOut={e => (e.currentTarget.style.border = '2px dashed #a5b4fc')}
          >
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" style={{marginBottom: 8}}><path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="16" width="16" height="4" rx="2" fill="#6366f1" opacity=".1"/></svg>
            Kéo thả hoặc bấm để chọn file/ảnh
            <input
              id="file-upload"
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
          {selectedFiles.length > 0 && (
            <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
              {selectedFiles.map((file, idx) => (
                <li key={idx} style={{ color: '#334155', fontSize: 15 }}>{file.name}</li>
              ))}
            </ul>
          )}
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
            style={{
              padding: '10px 32px',
              background: selectedFiles.length === 0 ? '#a5b4fc' : '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 16,
              cursor: selectedFiles.length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: selectedFiles.length === 0 ? 'none' : '0 2px 8px #6366f133',
              transition: 'background 0.2s',
            }}
          >
            <span style={{display:'flex',alignItems:'center',gap:6}}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Gửi bài
            </span>
          </button>
        </section>

        {/* Lịch sử nộp bài */}
        <section>
          <h2 style={{ fontSize: 20, marginBottom: 12, color: '#3730a3', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{marginRight: 6}}><circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2"/><path d="M8 12.5l2.5 2.5 5-5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Lịch sử nộp bài
          </h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {submissions.map((sub, idx) => (
              <li
                key={idx}
                style={{
                  border: '1.5px solid #e0e7ff',
                  borderRadius: 10,
                  marginBottom: 16,
                  padding: 16,
                  background: '#f8fafc',
                  boxShadow: '0 2px 8px #e0e7ff33',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ marginRight: 8 }}>
                    {sub.status === 'Đã chấm' ? (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M8 12.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : (
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fbbf24"/><path d="M12 8v4l3 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </span>
                  <b style={{ color: sub.status === 'Đã chấm' ? '#22c55e' : '#f59e42' }}>{sub.status}</b>
                  {sub.score !== null && (
                    <span style={{ marginLeft: 10, color: '#6366f1', fontWeight: 600 }}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style={{marginRight:2,verticalAlign:'middle'}}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#facc15"/></svg>
                      Điểm: {sub.score}
                    </span>
                  )}
                </div>
                <div style={{ color: '#334155', fontSize: 15, marginBottom: 4 }}>
                  <b>Thời gian:</b> {sub.time}
                </div>
                <div style={{ color: '#334155', fontSize: 15, marginBottom: 4 }}>
                  <b>File đã nộp:</b> {sub.files.join(', ')}
                </div>
                {sub.comment && (
                  <div style={{ marginTop: 8, color: '#6366f1', background: '#eef2ff', borderRadius: 6, padding: '8px 12px', fontStyle: 'italic' }}>
                    <b>Nhận xét:</b> {sub.comment}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
