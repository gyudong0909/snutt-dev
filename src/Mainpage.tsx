import './reset.css';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import studylistIcon from './icons/studylist.png';
import styles from './Mainpage.module.css';

interface MainPageProps {
  token: string;
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

const MainPage = ({ token }: MainPageProps) => {
  const [TimetableData, setTimetableData] = useState<TimetableResponse>();
  const [credit, setCredit] = useState(0);
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState<Schedule[]>([
    // {
    //   name: '미디어프로그래밍 프로젝트',
    //   location: '49-301',
    //   day: 1,
    //   startTime: 9,
    //   startMinute: 0,
    //   duration: 75,
    //   color: '#FF6B6B',
    // }, // 9:00 ~ 10:15
    // {
    //   name: '편집디자인',
    //   location: '49-215',
    //   day: 3,
    //   startTime: 10,
    //   startMinute: 10,
    //   duration: 20,
    //   color: '#FFA500',
    // }, // 10:10 ~ 10:30
    // {
    //   name: '중국어교과 논리 및 논술',
    //   location: '1-210',
    //   day: 0,
    //   startTime: 9,
    //   startMinute: 20,
    //   duration: 10,
    //   color: '#32CD32',
    // }, // 9:20 ~ 9:30
    // {
    //   name: '미디어프리젠테이션',
    //   location: '49-215',
    //   day: 1,
    //   startTime: 15,
    //   startMinute: 0,
    //   duration: 40,
    //   color: '#1E90FF',
    // }, // 15:00 ~ 15:40
    // {
    //   name: '18세기프랑스 문학',
    //   location: '5-206',
    //   day: 1,
    //   startTime: 17,
    //   startMinute: 10,
    //   duration: 20,
    //   color: '#20B2AA',
    // }, // 17:10 ~ 17:30
    // {
    //   name: '통합창의디자인 프로젝트',
    //   location: '49-B101',
    //   day: 4,
    //   startTime: 18,
    //   startMinute: 20,
    //   duration: 10,
    //   color: '#ADFF2F',
    // }, // 18:20 ~ 18:30
  ]);

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
    const totalCredits = TimetableData?.lecture_list.reduce(
      (sum, lecture) => sum + lecture.credit,
      0,
    );
    if (totalCredits !== undefined) setCredit(totalCredits);
    if (TimetableData !== undefined)
      setSchedule(formatLectureData(TimetableData));
  }, [TimetableData]);

  useEffect(() => {
    const fetchTimetableRequest = async (retryCount = 3): Promise<void> => {
      while (retryCount > 0) {
        try {
          const response = await fetch(
            `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/tables/recent`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
              },
            },
          );

          if (!response.ok) {
            throw new Error('시간표 정보를 가져오는 데 실패했습니다.');
          }

          const data = (await response.json()) as TimetableResponse;
          setTimetableData(data);
          return;
        } catch (error) {
          retryCount -= 1;
          if (retryCount === 0) {
            console.error(
              '시간표 정보를 가져오는 도중 오류가 발생했습니다:',
              error,
            );
          }
        }
      }
    };

    void fetchTimetableRequest();
  }, [token]);

  const handleNavigateToLectureList = () => {
    if (TimetableData != null) {
      navigate(`/timetables/${TimetableData._id}/lectures`);
    }
  };

  const handleNavigateToLectureDetail = (lectureId: string) => {
    if (TimetableData != null) {
      navigate(`/timetables/${TimetableData._id}/lectures/${lectureId}`);
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
              <span className={styles.titleText}>{TimetableData?.title}</span>
              <span className={styles.creditText}>({credit}학점)</span>
            </div>
            <div className={styles.frame208}>
              {TimetableData != null && (
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

        {/* {TimetableData?.lecture_list.map((lecture) => {
          return (
            <div
              key={lecture._id}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div>강의명: {lecture.course_title}</div>
              <div>교수님: {lecture.instructor}</div>
              <div>
                시간: {lecture.class_time_json[0].start_time} ~{' '}
                {lecture.class_time_json[0].end_time}
                일:
                {lecture.class_time_json[0].day}
              </div>
              <div>
                {' '}
                분: {lecture.class_time_json[0].startMinute},{' '}
                {lecture.class_time_json[0].endMinute}{' '}
              </div>
              <br />
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

export default MainPage;
