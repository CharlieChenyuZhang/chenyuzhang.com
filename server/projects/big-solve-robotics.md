---
title: Humanoid Robot Prototyping and Control at Big Solve Robotics
subtitle: Developing accessible humanoid robotics through motor control, real-time visualization, and public demonstrations
published: true
id: 0
author: Chenyu Zhang
date: June 1, 2016
keywords:
  - Robotics
  - Python
  - Real-Time Visualization
  - Humanoid Robots
  - Hardware Integration
thumbnail: https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/big_solve_robotics/mkiii_0_720.jpg
thumbnail_credit: James Schuback
chips:
  - Hardware
  - Robotics
  - HCI
  - Completed
---

## Abstract

During my internship at Big Solve Robotics, I developed a Python-based control system for a humanoid robot’s seven motors, created a real-time data visualization interface, and assisted in assembling and showcasing robot prototypes. These efforts culminated in public demonstrations at the Toronto Maker Festival, where attendees interacted with the robots, guiding their movements via keyboard input. This project aimed to make advanced robotics more accessible and user-friendly by integrating software, hardware, and intuitive control interfaces.

## Overview

Humanoid robots present unique challenges in terms of motor coordination, sensor integration, and user experience. At Big Solve Robotics, I focused on building and refining a platform that could be assembled from scratch, controlled with Python-based scripts, and visualized in real-time through a custom UI. The prototypes were demonstrated publicly, providing valuable feedback on usability and performance, and paving the way for future iterations.

![image](https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/big_solve_robotics/big_solve_robotics_720.jpg)

## Background & Related Work

Traditional humanoid robotics research often involves expensive and proprietary systems. By leveraging open-source tools (e.g., Python, Pygame), commodity hardware, and efficient communication between motors and drivers, we aimed to lower the barrier to entry. Existing literature and industry trends emphasize the importance of real-time feedback, modular architecture, and user interaction for more effective robot control and demonstration.

## Motivation

The main driving factors behind this project were:

- **Accessibility**: Lowering the complexity of controlling multiple motors and interpreting sensor data.
- **Real-Time Feedback**: Providing immediate, visual feedback to operators for faster debugging and learning.
- **Public Engagement**: Showcasing the technology to a wide audience at events like the Toronto Maker Festival to gather non-expert feedback.

## Problem Definition

How can we design a scalable and modular control system for a humanoid robot that allows for real-time motor control, data visualization, and public interaction?

This includes:

- Coordinating seven motors in a humanoid robot.
- Providing a UI that visualizes motor states, sensor readings, and command histories in real time.
- Facilitating user input (e.g., keyboard) for direct robot control during demonstrations.

## Approach / Methodology

1. **Motor Control Script**  
   Implemented a Python-based script to control seven motors via serial communication with motor drivers. This ensured precise, synchronized movements of the robot’s joints.

2. **Real-Time Visualization UI**  
   Developed a UI using Python’s Pygame and some C extensions for performance. The interface displayed motor positions, speeds, and sensor data streams on-the-fly, allowing operators and observers to understand the robot’s behavior at a glance.

   ![image](https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/big_solve_robotics/UI.jpeg)

3. **Prototype Assembly**  
   Assembled multiple humanoid robot prototypes (e.g., MkIII, MkIV versions) from scratch. This involved connecting motors, drivers, and sensors, as well as calibrating each joint for optimal performance.

   ![image](https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/big_solve_robotics/mkiii_0_720.jpg)

4. **Public Demonstration**  
    Showcased the prototypes at the Toronto Maker Festival. Over 511 participants interacted with the robots via a simple keyboard interface, providing valuable insights into usability.

      <video width="640" height="360" controls>
     <source src="https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/big_solve_robotics/MkIII+Prototype+Vid.mp4" type="video/mp4">
     Your browser does not support the video tag.
   </video>
     
     
     After the Toronto Maker Festival, this is our next iteration:
      <video width="640" height="360" controls>
     <source src="https://chenyuzhang-com-assets.s3.us-east-1.amazonaws.com/big_solve_robotics/MkIV+Prototype+Demonstration.mp4" type="video/mp4">
     Your browser does not support the video tag.
   </video>

## What’s Interesting / Innovative

- **Real-Time Data Feedback**: Immediate visualization of motor states and sensor data made troubleshooting and iterative improvement much simpler.
- **Public Interaction**: Allowing attendees to control the robot validated the project’s user-focused design approach.
- **Modular Architecture**: The use of Python scripts, open-source libraries, and straightforward hardware interfaces encouraged adaptability and scaling.

## Implementation Details

- **Software**: Python for control logic and Pygame for UI. Some components in C to enhance performance.
- **Hardware**: DC motors, drivers, sensors, and a humanoid robot frame designed for easy assembly and maintenance.
- **Testing Environment**: Linux-based systems for development and debugging. USB-serial adapters for communication with drivers.

## Results

- **Successful Synchronization of Motors**: The system reliably controlled seven motors, enabling basic humanoid movements.
- **Engaging UI**: The real-time visualization allowed both developers and public participants to understand the robot’s behavior.
- **Positive Reception at Maker Festival**: Over 511 interactions provided valuable user feedback, confirming the system’s accessibility and generating interest.

## Analysis & Discussion

The project demonstrated that with careful design and open-source tools, it’s possible to build humanoid robot prototypes that are interactive, transparent in their operation, and approachable for a broad audience. The real-time UI and keyboard control interface lowered the entry barrier for interacting with advanced robotics technology.

## Limitations

- **Scalability**: While controlling seven motors is feasible, scaling this approach to more complex humanoid robots or additional joints may require further optimization.
- **Hardware Constraints**: The chosen hardware components determined performance ceilings. Higher-level tasks or more robust designs may require upgraded hardware.

## Future Vision

- **Enhanced Control Algorithms**: Integrating more sophisticated control loops or learning-based controllers to improve stability and adaptability.
- **More Sensors & Data Analytics**: Adding more sensor types and using advanced analytics or machine learning to better understand and predict robot performance.
- **Broader Public Engagement**: Offering workshops, tutorials, and kits to further democratize humanoid robotics.

## Acknowledgements

Thanks to the Big Solve Robotics team for guidance and resources, and to the Toronto Maker Festival community for their enthusiastic participation and feedback.

## References

- [Pygame Documentation](https://www.pygame.org/docs/)
- Relevant Robotics & AI Research Literature

## Contact Information

For further details, please reach out to: **Chenyu Zhang**  
Email: contact [at] chenyuzhang [dot] com

---

**Appendices (if needed):**

- Detailed motor specifications and driver configurations
- Additional code snippets for UI rendering and sensor integration
- Extended logs and sensor datasets
