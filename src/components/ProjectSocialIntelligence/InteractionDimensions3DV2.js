import React, { useState } from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

const MainContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
  padding: 20px;
`;

const ContentContainer = styled.div`
  margin: 20px;
  width: 100%;
  max-width: 960px;
  padding: 2rem;
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: #fff;
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  background-color: yellow;
  border-radius: 50%;
  margin-right: 8px;
`;

const ListContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #111;
  border-radius: 8px;
  max-width: 960px;
  color: #fff;
`;

const ListItem = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 1.5;
`;

export default function IceBreaking() {
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    // Your existing logic for handleGenerate
  };

  return (
    <MainContainer>
      <ContentContainer>
        <Legend>
          <LegendDot />{" "}
          <Typography variant="body1">Conflict Resolution</Typography>
        </Legend>

        <Typography variant="h4" align="center" gutterBottom>
          Dimensions of Interactions
        </Typography>

        <Canvas
          camera={{ position: [6, 6, 6], fov: 45 }}
          style={{ height: "500px" }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <InteractionDimensions3D />
          <OrbitControls enableZoom={true} maxDistance={15} minDistance={5} />
        </Canvas>
      </ContentContainer>

      {/* Conflict Resolution List */}
      <ListContainer>
        <Typography variant="h5" align="center" gutterBottom>
          Conflict Resolution Scenarios
        </Typography>
        {interactionScenarios.map((scenario, index) => (
          <ListItem key={index}>
            {index + 1}. {scenario.label} <b>({scenario.category})</b>
          </ListItem>
        ))}
      </ListContainer>
    </MainContainer>
  );
}

function InteractionDimensions3D() {
  const [hovered, setHovered] = useState(null);

  return (
    <>
      {/* Axis lines */}
      <mesh>
        {/* Y-Axis */}
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, 0, 5, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="white" />
        </line>

        {/* X-Axis */}
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, 5, 0, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="white" />
        </line>

        {/* Z-Axis */}
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, 0, 0, 5])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="white" />
        </line>
      </mesh>

      {/* Y-Axis Labels and Ticks */}
      <TickWithLabel position={[0, 1, 0]} label="Signals" />
      <TickWithLabel position={[0, 2, 0]} label="Behaviors & Acts" />
      <TickWithLabel position={[0, 3, 0]} label="Events" />
      <TickWithLabel position={[0, 4, 0]} label="Situations" />
      <TickWithLabel position={[0, 5, 0]} label="Networks" />

      {/* X-Axis Labels and Ticks */}
      <TickWithLabel position={[1, 0, 0]} label="Monad" horizontal />
      <TickWithLabel position={[2, 0, 0]} label="Dyad" horizontal />
      <TickWithLabel position={[3, 0, 0]} label="Multi-Party" horizontal />

      {/* Z-Axis Labels and Ticks */}
      <TickWithLabel position={[0, 0, 1]} label="Moment" horizontal />
      <TickWithLabel position={[0, 0, 2]} label="Short-Term" horizontal />
      <TickWithLabel position={[0, 0, 3]} label="Life-Long" horizontal />

      {/* Axis Titles */}
      <Text position={[0, 5.5, 0]} fontSize={0.3} color="lightgreen">
        Hierarchical Social Units
      </Text>
      <Text position={[5.5, 0, 0]} fontSize={0.3} color="lightgreen">
        Interaction Structures
      </Text>
      <Text position={[0, 0, 5.5]} fontSize={0.3} color="lightgreen">
        Temporal Scale
      </Text>

      {/* Plotting Interaction Scenarios as dots */}
      {interactionScenarios.map((scenario, index) => (
        <mesh
          key={index}
          position={scenario.position}
          onPointerOver={() => setHovered(scenario)}
          onPointerOut={() => setHovered(null)}
        >
          {/* Dot */}
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="yellow" />

          {/* Display label on hover */}
          {hovered === scenario && (
            <Text position={[0, 0.3, 0]} fontSize={0.2} color="yellow">
              {`${scenario.label} (${scenario.category})`}
            </Text>
          )}
        </mesh>
      ))}
    </>
  );
}

function TickWithLabel({ position, label, horizontal = false, depth = false }) {
  const tickLength = 0.2;
  const offset = 0.3;

  return (
    <>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={
              horizontal
                ? new Float32Array([
                    position[0],
                    position[1],
                    position[2],
                    position[0],
                    position[1] - tickLength,
                    position[2],
                  ])
                : depth
                ? new Float32Array([
                    position[0],
                    position[1],
                    position[2],
                    position[0] - tickLength,
                    position[1],
                    position[2],
                  ])
                : new Float32Array([
                    position[0],
                    position[1],
                    position[2],
                    position[0],
                    position[1],
                    position[2] - tickLength,
                  ])
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="white" />
      </line>

      <Text
        position={
          horizontal
            ? [position[0], position[1] - offset, position[2]]
            : depth
            ? [position[0] - offset, position[1], position[2]]
            : [position[0], position[1], position[2] - offset]
        }
        fontSize={0.2}
        color="white"
      >
        {label}
      </Text>
    </>
  );
}

const interactionScenarios = [
  {
    label: "Interpersonal Conflict",
    position: [2, 2, 1],
    category: "Dyad, Behaviors & Acts, Moment",
  },
  {
    label: "Team Conflict",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "Management-Employee Dispute",
    position: [2, 3, 1],
    category: "Dyad, Events, Moment",
  },
  {
    label: "Department Policy Disagreement",
    position: [3, 5, 2],
    category: "Multi-Party, Networks, Short-Term",
  },
  {
    label: "Conflict Resolution Workshop",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Customer Service Escalation",
    position: [2, 4, 1],
    category: "Dyad, Situations, Moment",
  },
  {
    label: "Cross-Functional Disagreement",
    position: [3, 3, 2],
    category: "Multi-Party, Events, Short-Term",
  },
  {
    label: "Organizational Conflict",
    position: [3, 5, 3],
    category: "Multi-Party, Networks, Life-Long",
  },
  {
    label: "Union-Management Conflict",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Cultural Differences",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "High-Stakes Negotiation",
    position: [2, 4, 1],
    category: "Dyad, Situations, Moment",
  },
  {
    label: "Social Media Backlash",
    position: [3, 1, 1],
    category: "Multi-Party, Signals, Moment",
  },
  {
    label: "Budget Allocation Dispute",
    position: [3, 5, 2],
    category: "Multi-Party, Networks, Short-Term",
  },
  {
    label: "Sales and Marketing Alignment Conflict",
    position: [3, 3, 2],
    category: "Multi-Party, Events, Short-Term",
  },
  {
    label: "Employee Harassment Complaint",
    position: [2, 3, 1],
    category: "Dyad, Events, Moment",
  },
  {
    label: "Conflict over Remote Work Policy",
    position: [3, 5, 2],
    category: "Multi-Party, Networks, Short-Term",
  },
  {
    label: "Dispute over Resource Allocation",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "Conflict in Project Prioritization",
    position: [3, 3, 2],
    category: "Multi-Party, Events, Short-Term",
  },
  {
    label: "CEO and Board Disagreement",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Merger Integration Conflict",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "Tech Team Disagreement over Stack Choices",
    position: [3, 3, 2],
    category: "Multi-Party, Events, Short-Term",
  },
  {
    label: "Employee vs. Manager Burnout Discussion",
    position: [2, 3, 1],
    category: "Dyad, Events, Moment",
  },
  {
    label: "Unethical Practices Allegation",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Conflict between Founders",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Union Strike Negotiation",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Supplier Dispute over Contract Terms",
    position: [2, 4, 1],
    category: "Dyad, Situations, Moment",
  },
  {
    label: "Product Team vs. Marketing Conflict",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "Global Team Conflict due to Time Zones",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "Competing Vendors in Bidding Process",
    position: [2, 3, 1],
    category: "Dyad, Events, Moment",
  },
  {
    label: "Diversity and Inclusion Program Backlash",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Executive Pay Disagreement",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Intellectual Property Dispute",
    position: [2, 4, 2],
    category: "Dyad, Situations, Short-Term",
  },
  {
    label: "Workplace Accommodation Dispute",
    position: [2, 3, 2],
    category: "Dyad, Events, Short-Term",
  },
  {
    label: "Sustainability Policy Disagreement",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Legal Conflict with Former Employees",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Cybersecurity Incident Blame Assignment",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "Performance Review Dispute",
    position: [2, 2, 1],
    category: "Dyad, Behaviors & Acts, Moment",
  },
  {
    label: "Product Launch Deadline Tensions",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "Workplace Health and Safety Conflict",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Market Entry Strategy Disagreement",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "Offshore Team Delivery Delays",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "Legal Compliance vs. Business Goals Conflict",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Ethics Violation Accusation",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Conflict over Employee Benefits",
    position: [3, 5, 2],
    category: "Multi-Party, Networks, Short-Term",
  },
  {
    label: "Union Demands for Higher Wages",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Customer Refund Policy Backlash",
    position: [3, 1, 1],
    category: "Multi-Party, Signals, Moment",
  },
  {
    label: "Creative Differences in Ad Campaign",
    position: [3, 3, 2],
    category: "Multi-Party, Events, Short-Term",
  },
  {
    label: "Conflict in Succession Planning",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Interdepartmental Power Struggle",
    position: [3, 5, 2],
    category: "Multi-Party, Networks, Short-Term",
  },
  {
    label: "Sales Territory Allocation Dispute",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "Siloed Teams Miscommunication",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "Conflict over Expansion Plans",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Crisis Communication Mismanagement",
    position: [3, 1, 1],
    category: "Multi-Party, Signals, Moment",
  },
  {
    label: "Legal Risks in New Market Conflict",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Vendor Quality Issue Conflict",
    position: [2, 4, 1],
    category: "Dyad, Situations, Moment",
  },
  {
    label: "Executive Restructuring Backlash",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Dispute over Bonus Distribution",
    position: [3, 5, 2],
    category: "Multi-Party, Networks, Short-Term",
  },
  {
    label: "Patent Infringement Allegation",
    position: [2, 4, 1],
    category: "Dyad, Situations, Moment",
  },
  {
    label: "Public Relations Crisis Response",
    position: [3, 1, 1],
    category: "Multi-Party, Signals, Moment",
  },
  {
    label: "Workload Distribution Conflict",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "Recruitment Bias Allegation",
    position: [2, 3, 1],
    category: "Dyad, Events, Moment",
  },
  {
    label: "Conflict in Stakeholder Expectations",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "CEO vs. CFO Budget Planning Conflict",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Product Roadmap Prioritization Clash",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "Quality Assurance vs. Speed of Delivery",
    position: [3, 3, 2],
    category: "Multi-Party, Events, Short-Term",
  },
  {
    label: "Supply Chain Disruption Dispute",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "Cultural Integration in Mergers",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "Startup Founder Equity Disagreement",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Talent Retention Strategy Conflict",
    position: [3, 5, 2],
    category: "Multi-Party, Networks, Short-Term",
  },
  {
    label: "Shared Services Model Disagreement",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "AI Implementation Strategy Conflict",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "Conflict in R&D Funding Allocation",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "Marketing vs. Sales Attribution Debate",
    position: [3, 3, 2],
    category: "Multi-Party, Events, Short-Term",
  },
  {
    label: "Conflict over Company Mission Shift",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Dispute in Leadership Style",
    position: [2, 3, 1],
    category: "Dyad, Events, Moment",
  },
  {
    label: "Delayed Product Release Penalty Conflict",
    position: [2, 4, 1],
    category: "Dyad, Situations, Moment",
  },
  {
    label: "Employee Relocation Compensation Issue",
    position: [2, 3, 2],
    category: "Dyad, Events, Short-Term",
  },
  {
    label: "Conflict in Supplier Diversity Goals",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Sales Commission Plan Conflict",
    position: [3, 5, 2],
    category: "Multi-Party, Networks, Short-Term",
  },
  {
    label: "Dispute in Cross-Cultural Team Dynamics",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "Remote Collaboration Tool Conflict",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "Cybersecurity Breach Blame Conflict",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "Conflict in Open-Source vs. Proprietary Strategy",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "Conflict over Customer Data Privacy",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Competition over Promotion Opportunities",
    position: [3, 4, 2],
    category: "Multi-Party, Situations, Short-Term",
  },
  {
    label: "HR vs. Finance Employee Benefit Cost Conflict",
    position: [3, 5, 2],
    category: "Multi-Party, Networks, Short-Term",
  },
  {
    label: "Corporate Social Responsibility Investment Disagreement",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Cross-Border Team Leadership Conflict",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "Dispute Over Sustainability Reporting Accuracy",
    position: [3, 5, 2],
    category: "Multi-Party, Networks, Short-Term",
  },
  {
    label: "Conflict in Co-Branding Partnership",
    position: [2, 4, 1],
    category: "Dyad, Situations, Moment",
  },
  {
    label: "Workplace Political Alignment Disagreement",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Conflict over Remote Work Expense Policy",
    position: [3, 5, 2],
    category: "Multi-Party, Networks, Short-Term",
  },
  {
    label: "Disagreement on Corporate Philanthropy Initiatives",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Vendor Selection Disagreement",
    position: [2, 4, 1],
    category: "Dyad, Situations, Moment",
  },
  {
    label: "Cross-Generational Workforce Conflict",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
  {
    label: "AI Bias Allegation in Hiring Tools",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Conflict in Nonprofit and Corporate Collaboration",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Dispute Over Environmental Impact Strategies",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Conflict Over Cultural Festival Sponsorships",
    position: [3, 5, 3],
    category: "Multi-Party, Communities, Life-Long",
  },
  {
    label: "Conflict in Multi-National Branch Operations",
    position: [3, 4, 3],
    category: "Multi-Party, Situations, Life-Long",
  },
];
