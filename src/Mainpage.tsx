import './reset.css';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import studylistIcon from './icons/studylist.png';
import styles from './Mainpage.module.css';

interface MainPageProps {
  token: string;
  timetableData: TimetableResponse | null;
  setTimetableData: React.Dispatch<
    React.SetStateAction<TimetableResponse | null>
  >;
}

type TimetableResponse = {
  _id: string;
  user_id: string;
  year: number;
  semester: string;
  lecture_list: Array<{
    _id: string;
    academic_year: string;
    category: string;
    class_time_json: Array<{
      day: string;
      place: string;
      startMinute: number;
      endMinute: number;
      start_time: string;
      end_time: string;
      len: number;
      start: number;
      lectureBuildings: Array<{
        id: string;
        buildingNumber: string;
        buildingNameKor: string;
        buildingNameEng: string;
        locationInDMS: {
          latitude: number;
          longitude: number;
        };
        locationInDecimal: {
          latitude: number;
          longitude: number;
        };
        campus: string;
      }>;
    }>;
    classification: string;
    credit: number;
    department: string;
    instructor: string;
    lecture_number: string;
    quota: number;
    freshman_quota: number;
    remark: string;
    course_number: string;
    course_title: string;
    color: {
      bg: string;
      fg: string;
    };
    colorIndex: number;
    lecture_id: string;
    snuttEvLecture: {
      evLectureId: number;
    };
    class_time_mask: number[];
  }>;
  title: string;
  theme: string;
  themeId: string;
  isPrimary: boolean;
  updated_at: string;
};

interface Schedule {
  name: string;
  location: string;
  day: number; // 1: 월요일, 2: 화요일, ..., 5: 금요일
  startTime: number; // 시
  startMinute: number; // 분
  duration: number; // 분
  color: string;
  lectureId: string;
}

const MainPage = ({ timetableData }: MainPageProps) => {
  const [credit, setCredit] = useState(0);
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  // TimetableResponse를 Schedule 배열로 변환하는 함수
  const formatLectureData = (data: TimetableResponse) => {
    return data.lecture_list.flatMap((lecture) => {
      const lectureColor = '#333'; // 색상 기본값 설정
      return lecture.class_time_json.map((classTime) => {
        const duration = classTime.endMinute - classTime.startMinute;

        return {
          name: lecture.course_title,
          location: classTime.place,
          day: parseInt(classTime.day, 10), // '0' ~ '4'를 숫자로 변환
          startTime: Math.floor(classTime.startMinute / 60), // 시
          startMinute: classTime.startMinute % 60, // 분
          duration: duration, // 분
          color: lectureColor,
          lectureId: lecture._id,
        };
      });
    });
  };

  useEffect(() => {
    if (timetableData == null) return;

    const totalCredits = timetableData.lecture_list.reduce(
      (sum, lecture) => sum + lecture.credit,
      0,
    );
    setCredit(totalCredits);
    setSchedule(formatLectureData(timetableData));
  }, [timetableData]);

  const handleNavigateToLectureList = () => {
    if (timetableData != null) {
      navigate(`/timetables/${timetableData._id}/lectures`);
    }
  };

  const handleNavigateToLectureDetail = (lectureId: string) => {
    if (timetableData != null) {
      navigate(`/timetables/${timetableData._id}/lectures/${lectureId}`);
    }
  };

  const renderLectures = () => {
    const lectureElements = schedule.map((lecture, index) => {
      const { name, day, startTime, startMinute, duration, color } = lecture;

      // 하루의 시작 시간과 끝 시간 (예: 9시 ~ 21시)
      const dayStartTime = 9 * 60; // 분 단위
      const dayEndTime = 21 * 60; // 분 단위
      const dayTotalMinutes = dayEndTime - dayStartTime;

      // 강의의 시작 시간과 높이 계산
      const lectureStartMinutes = startTime * 60 + startMinute;
      const top =
        ((lectureStartMinutes - dayStartTime) / dayTotalMinutes) * 100;
      const height = (duration / dayTotalMinutes) * 100;

      // 요일에 따른 left 위치 계산
      const dayWidth = 100 / 5; // 5일 (월~금)
      const left = day * dayWidth;

      return (
        <div
          key={index}
          className={styles.lecture}
          style={{
            top: `${top}%`,
            left: `calc(${left}%)`,
            height: `${height}%`,
            backgroundColor: color,
            cursor: 'pointer',
          }}
          onClick={() => {
            handleNavigateToLectureDetail(lecture.lectureId);
          }}
        >
          <div className={styles.lectureContent}>
            {name}
            <br />
          </div>
        </div>
      );
    });

    return lectureElements;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.frame211}>
          <div className={styles.frame210}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19.067px"
              height="15.048px"
              viewBox="0 0 20 16"
              fill="none"
              style={{
                flexShrink: 0,
                fill: 'var(--Icon-Normal, #000)',
              }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.772949 0.727051H19.8396V1.59372H0.772949V0.727051ZM0.772964 7.8179H16.373V8.68457H0.772964V7.8179ZM19.8396 14.9088H0.772964V15.7755H19.8396V14.9088Z"
                fill="black"
              />
            </svg>
            <div className={styles.frame47}>
              <span className={styles.titleText}>{timetableData?.title}</span>
              <span className={styles.creditText}>({credit}학점)</span>
            </div>
            <div className={styles.frame208}>
              {timetableData != null && (
                <div className={styles.frame208}>
                  <img
                    src={studylistIcon}
                    onClick={handleNavigateToLectureList}
                    alt="studylistIcon"
                    style={{
                      width: '27px',
                      height: '23px',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.timetableContainer}>
          {/* 시간 레이블 */}
          <div className={styles.timeLabels}>
            {Array.from({ length: 13 }, (_, i) => (
              <div
                key={i}
                className={styles.timeLabel}
                style={{ top: `${(i / 12) * 100}%` }}
              >
                {9 + i}
              </div>
            ))}
          </div>
          {/* 요일 레이블 */}
          <div className={styles.dayLabels}>
            {['월', '화', '수', '목', '금'].map((day, index) => (
              <div key={index} className={styles.dayLabel}>
                {day}
              </div>
            ))}
          </div>
          {/* 격자선 */}
          <div className={styles.gridLines}>
            {/* 가로 격자선 (30분 간격) */}
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className={styles.horizontalLine}
                style={{
                  top: `${(i / 24) * 100}%`,
                  borderTop: `2px solid ${i % 2 === 1 ? '#F5F5F5' : '#EBEBED'}`,
                }}
              ></div>
            ))}
          </div>
          <div className={styles.gridLines}>
            {/* 세로 격자선 (월 화 수 목 금) */}
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={styles.verticalLine}
                style={{ left: `calc(${i * 20}%)` }}
              ></div>
            ))}
          </div>
          {/* 강의들 */}
          <div className={styles.lecturesWrapper}>{renderLectures()}</div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
