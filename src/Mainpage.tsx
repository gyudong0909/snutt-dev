import './reset.css';

import { useEffect, useState } from 'react';

import listIcon from './icons/list.png';
import styles from './Mainpage.module.css';

interface MainPageProps {
  token: string;
}

type TimetableResponse = {
  _id: 'string';
  user_id: 'string';
  year: 0;
  semester: '1';
  lecture_list: [
    {
      _id: 'string';
      academic_year: 'string';
      category: 'string';
      class_time_json: [
        {
          day: '0';
          place: 'string';
          startMinute: 0;
          endMinute: 0;
          start_time: 'string';
          end_time: 'string';
          len: 0;
          start: 0;
          lectureBuildings: [
            {
              id: 'string';
              buildingNumber: 'string';
              buildingNameKor: 'string';
              buildingNameEng: 'string';
              locationInDMS: {
                latitude: 0;
                longitude: 0;
              };
              locationInDecimal: {
                latitude: 0;
                longitude: 0;
              };
              campus: 'GWANAK';
            },
          ];
        },
      ];
      classification: 'string';
      credit: 0;
      department: 'string';
      instructor: 'string';
      lecture_number: 'string';
      quota: 0;
      freshman_quota: 0;
      remark: 'string';
      course_number: 'string';
      course_title: 'string';
      color: {
        bg: 'string';
        fg: 'string';
      };
      colorIndex: 0;
      lecture_id: 'string';
      snuttEvLecture: {
        evLectureId: 0;
      };
      class_time_mask: [0];
    },
  ];
  title: 'string';
  theme: '0';
  themeId: 'string';
  isPrimary: true;
  updated_at: '2024-11-08T09:35:57.664Z';
};

const MainPage = ({ token }: MainPageProps) => {
  const [TimetableData, setTimetableData] = useState<TimetableResponse>();
  const [credit, setCredit] = useState(0);

  const [schedule, setSchedule] = useState([
    {
      name: '미디어프로그래밍 프로젝트',
      location: '49-301',
      day: 1,
      startTime: 9,
      startMinute: 0,
      duration: 75,
      color: '#FF6B6B',
    }, // 9:00 ~ 10:15
    {
      name: '편집디자인',
      location: '49-215',
      day: 3,
      startTime: 10,
      startMinute: 10,
      duration: 20,
      color: '#FFA500',
    }, // 10:10 ~ 10:30
    {
      name: '중국어교과 논리 및 논술',
      location: '1-210',
      day: 0,
      startTime: 9,
      startMinute: 20,
      duration: 10,
      color: '#32CD32',
    }, // 9:20 ~ 9:30
    {
      name: '미디어프리젠테이션',
      location: '49-215',
      day: 1,
      startTime: 15,
      startMinute: 0,
      duration: 40,
      color: '#1E90FF',
    }, // 15:00 ~ 15:40
    {
      name: '18세기프랑스 문학',
      location: '5-206',
      day: 1,
      startTime: 17,
      startMinute: 10,
      duration: 20,
      color: '#20B2AA',
    }, // 17:10 ~ 17:30
    {
      name: '통합창의디자인 프로젝트',
      location: '49-B101',
      day: 4,
      startTime: 18,
      startMinute: 20,
      duration: 10,
      color: '#ADFF2F',
    }, // 18:20 ~ 18:30
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
    const fetchTimetableRequest = async () => {
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
      return response;
    };

    const requestTimetable = async () => {
      const TimetableResponse = await fetchTimetableRequest();
      if (!TimetableResponse.ok) {
        alert('timetableRequest fetch 오류 발생');
      }
      const data = (await TimetableResponse.json()) as TimetableResponse;
      setTimetableData(data);
    };
    requestTimetable().catch((e: unknown) => {
      alert(e);
    });
  }, [token]);

  const renderLectures = () => {
    const lectureElements = schedule.map((lecture, index) => {
      const { name, location, day, startTime, startMinute, duration, color } =
        lecture;

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
            left: `${left}%`,
            height: `${height}%`,
            backgroundColor: color,
          }}
        >
          <div className={styles.lectureContent}>
            {name}
            <br />
            {location}
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
            <img src={listIcon} alt="list" className={styles.disabled} />
            <div className={styles.frame47}>
              <span className={styles.titleText}>{TimetableData?.title}</span>
              <span className={styles.creditText}>({credit}학점)</span>
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
                  borderTop: `1px solid ${i % 2 === 1 ? '#F5F5F5' : '#EBEBED'}`,
                }}
              ></div>
            ))}
          </div>
          <div className={styles.gridLines}>
            {/* 세로 격자선 (월 화 수 목 금) */}
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={styles.verticalLine}
                style={{ left: `calc(${(i + 1) * 20}%)` }}
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
