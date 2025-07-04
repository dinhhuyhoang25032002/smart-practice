import moment from 'moment-timezone';

export const formatTimeVi = (time: string | Date) => {
    return moment.utc(time).tz("Asia/Ho_Chi_Minh").locale("vi").
        format("dddd [ngày] D [tháng] M [năm] YYYY HH:mm:ss").charAt(0).toUpperCase() +
        moment.utc(time).tz("Asia/Ho_Chi_Minh").locale("vi")
            .format("dddd [ngày] D [tháng] M [năm] YYYY HH:mm:ss").slice(1)
}