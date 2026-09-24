import { useEffect, useState } from "react";
import {Box,Card,CardContent,Grid,Typography,TextField,Chip,Tabs,Tab,Paper,Stack,Divider,Avatar,} from "@mui/material";

function UserManagementPage() {
  const username =
    localStorage.getItem("username") ||
    "Rahul Singh";

  const role =
    localStorage.getItem("role") ||
    "MANAGER";

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] =
    useState("myTeam");

  const [selectedLead, setSelectedLead] =
    useState(null);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const currentManager = null;

  const myLeads =
    currentManager?.leads || [];

  const otherTeams = [];

  const [selectedOtherTeam, setSelectedOtherTeam] =
    useState(otherTeams[0] || null);

  const [selectedOtherLead, setSelectedOtherLead] =
    useState(otherTeams[0]?.leads?.[0] || null);

  const [selectedOtherEmployee, setSelectedOtherEmployee] =
    useState(null);

  const filteredOtherTeams = otherTeams.filter(
    (team) =>
      team.managerName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      team.leads.some(
        (lead) =>
          lead.leadName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          lead.project
            .toLowerCase()
            .includes(search.toLowerCase())
      )
  );

  useEffect(() => {
    if (
      role === "MANAGER" &&
      myLeads.length > 0 &&
      !selectedLead
    ) {
      setSelectedLead(myLeads[0]);
    }
  }, [myLeads, selectedLead, role]);

  useEffect(() => {
    if (otherTeams.length > 0 && !selectedOtherTeam) {
      setSelectedOtherTeam(otherTeams[0]);
      setSelectedOtherLead(otherTeams[0].leads[0]);
    }
  }, [otherTeams, selectedOtherTeam]);

  const filteredLeads = myLeads.filter(
    (lead) =>
      lead.leadName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      lead.project
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 4,
        minHeight: "calc(100vh - 96px)",
        backgroundColor: "#F8FAFC",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Team Management
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            View team hierarchy, projects and ratings
          </Typography>
        </Box>

        <Chip
          label={`${myLeads.length + otherTeams.length} Teams in View`}
          color="primary"
          variant="outlined"
          sx={{ height: 34 }}
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid #E5E7EB",
          p: 2,
          mb: 4,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, value) =>
              setActiveTab(value)
            }
            sx={{
              minHeight: 44,
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "4px 4px 0 0",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                minHeight: 44,
                px: 3,
              },
            }}
          >
            <Tab value="myTeam" label="My Team" />
            <Tab value="otherTeams" label="Other Teams" />
          </Tabs>

          <TextField
            size="small"
            placeholder="Search Lead, Employee or Project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              minWidth: { xs: "100%", md: 360 },
              maxWidth: { xs: "100%", md: 420 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#F9FAFB",
              },
            }}
          />
        </Stack>
      </Paper>

      {/* MY TEAM */}

      {activeTab === "myTeam" && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: "1px solid #D1D5DB",
                backgroundColor: "#FFFFFF",
                p: 2.5,
                height: "100%",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Team Leads
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filteredLeads.length} active leads
                  </Typography>
                </Box>

                <Chip
                  label="Operations"
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Stack>

              <Stack spacing={2}>
                {filteredLeads.map((lead) => (
                  <Card
                    key={lead.leadId}
                    onClick={() => {
                      setSelectedLead(lead);
                      setSelectedEmployee(null);
                    }}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 3,
                      border:
                        selectedLead?.leadId === lead.leadId
                          ? "2px solid #1D4ED8"
                          : "1px solid #E5E7EB",
                      backgroundColor:
                        selectedLead?.leadId === lead.leadId
                          ? "#EFF6FF"
                          : "#FFFFFF",
                      transition: "all 180ms ease",
                      boxShadow:
                        selectedLead?.leadId === lead.leadId
                          ? "0 8px 20px rgba(29, 78, 216, 0.14)"
                          : "none",
                      "&:hover": {
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent sx={{ py: 2.2, px: 2.2 }}>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            bgcolor: "#1E293B",
                            fontWeight: 700,
                          }}
                        >
                          {lead.leadName
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={700}>
                            {lead.leadName}
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {lead.project}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1.8, flexWrap: "wrap" }}
                      >
                        <Chip
                          label={`Team ${lead.employees.length}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                        <Chip
                          label={`Rating ${lead.rating}`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={8}>
            {selectedLead ? (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid #D1D5DB",
                  backgroundColor: "#FFFFFF",
                  p: 3,
                  height: "100%",
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  alignItems={{ xs: "flex-start", md: "center" }}
                  justifyContent="space-between"
                  spacing={2}
                  mb={2}
                >
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      Team Lead / Operational Profile
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {selectedLead.leadName}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      {selectedLead.project}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      label={`Lead ID ${selectedLead.leadId}`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Rating ${selectedLead.rating}`}
                      color="success"
                      variant="filled"
                    />
                    <Chip
                      label={`${selectedLead.employees.length} Employees`}
                      color="default"
                    />
                  </Stack>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: "#F8FAFC",
                        borderRadius: 3,
                        border: "1px solid #E5E7EB",
                        p: 2.6,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ color: "#475569" }}>
                        Lead Details
                      </Typography>

                      <Stack spacing={2} sx={{ mt: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Lead Name
                          </Typography>
                          <Typography fontWeight={700}>
                            {selectedLead.leadName}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Department
                          </Typography>
                          <Typography fontWeight={700}>
                            {currentManager.department}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Current Project
                          </Typography>
                          <Typography fontWeight={700}>
                            {selectedLead.project}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Last Project
                          </Typography>
                          <Typography fontWeight={700}>
                            {selectedLead.lastProject || "Knowledge Automation"}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Team Rating
                          </Typography>
                          <Typography fontWeight={700}>
                            {selectedLead.rating}/5.0
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <Box>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          Workstream Team
                        </Typography>
                        <Chip
                          label="Direct Reports"
                          color="primary"
                          size="small"
                        />
                      </Stack>

                      <Stack spacing={1.4}>
                        {selectedLead.employees.map((employee) => (
                          <Card
                            key={employee.empId}
                            onClick={() => setSelectedEmployee(employee)}
                            sx={{
                              borderRadius: 3,
                              cursor: "pointer",
                              border:
                                selectedEmployee?.empId === employee.empId
                                  ? "2px solid #1D4ED8"
                                  : "1px solid #E5E7EB",
                              backgroundColor:
                                selectedEmployee?.empId === employee.empId
                                  ? "#EFF6FF"
                                  : "#FFFFFF",
                              "&:hover": {
                                boxShadow: 2,
                              },
                            }}
                          >
                            <CardContent sx={{ py: 1.6, px: 2.2 }}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Box>
                                  <Typography fontWeight={700}>
                                    {employee.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {employee.project}
                                  </Typography>
                                </Box>

                                <Stack direction="row" spacing={1}>
                                  <Chip
                                    label={`Rating ${employee.rating}`}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                  />
                                  <Chip
                                    label={employee.department}
                                    size="small"
                                    variant="outlined"
                                  />
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>

                {selectedEmployee && (
                  <Box sx={{ mt: 3 }}>
                    <Divider sx={{ mb: 3 }} />
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 3,
                        border: "1px solid #94A3B8",
                        backgroundColor: "#0F172A",
                        color: "#FFFFFF",
                        p: 2.6,
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", md: "center" }}
                        spacing={2}
                      >
                        <Box>
                          <Typography variant="overline" sx={{ color: "#CBD5E1" }}>
                            Employee Detail
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            {selectedEmployee.name}
                          </Typography>
                        </Box>

                        <Chip
                          label={`Rating ${selectedEmployee.rating}`}
                          color="success"
                          sx={{ color: "#000", backgroundColor: "#BBF7D0" }}
                        />
                      </Stack>

                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="#CBD5E1">
                            Employee ID
                          </Typography>
                          <Typography fontWeight={700}>
                            {selectedEmployee.empId}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="#CBD5E1">
                            Department
                          </Typography>
                          <Typography fontWeight={700}>
                            {selectedEmployee.department}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="#CBD5E1">
                            Current Project
                          </Typography>
                          <Typography fontWeight={700}>
                            {selectedEmployee.project}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="#CBD5E1">
                            Last Project
                          </Typography>
                          <Typography fontWeight={700}>
                            {selectedEmployee.lastProject || "Previous Program Rollout"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="#CBD5E1">
                            Experience
                          </Typography>
                          <Typography fontWeight={700}>
                            {selectedEmployee.experience} Years
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                )}
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{ p: 4, borderRadius: 4, border: "1px solid #E5E7EB" }}
              >
                <Typography variant="h6">
                  No lead selected
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}

      {/* OTHER TEAMS */}

      {activeTab === "otherTeams" && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: "1px solid #D1D5DB",
                backgroundColor: "#FFFFFF",
                p: 2.5,
                height: "100%",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Other Teams
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filteredOtherTeams.length} active team(s)
                  </Typography>
                </Box>

                <Chip
                  label="External"
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Stack>

              <Stack spacing={2}>
                {filteredOtherTeams.map((team) => (
                  <Card
                    key={team.managerName}
                    onClick={() => {
                      setSelectedOtherTeam(team);
                      setSelectedOtherLead(team.leads[0] || null);
                      setSelectedOtherEmployee(null);
                    }}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 3,
                      border:
                        selectedOtherTeam?.managerName === team.managerName
                          ? "2px solid #1D4ED8"
                          : "1px solid #E5E7EB",
                      backgroundColor:
                        selectedOtherTeam?.managerName === team.managerName
                          ? "#EFF6FF"
                          : "#FFFFFF",
                      transition: "all 180ms ease",
                      boxShadow:
                        selectedOtherTeam?.managerName === team.managerName
                          ? "0 8px 20px rgba(29, 78, 216, 0.14)"
                          : "none",
                      "&:hover": {
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent sx={{ py: 2, px: 2.2 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            bgcolor: "#334155",
                            fontWeight: 700,
                          }}
                        >
                          {team.managerName
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={700}>
                            {team.managerName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {team.department}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1} sx={{ mt: 1.8, flexWrap: "wrap" }}>
                        <Chip label={`${team.leads.length} Lead(s)`} size="small" variant="outlined" />
                        <Chip label={`${team.leads.reduce((sum, lead) => sum + lead.employees.length, 0)} Employees`} size="small" variant="outlined" />
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={8}>
            {selectedOtherTeam ? (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid #D1D5DB",
                  backgroundColor: "#FFFFFF",
                  p: 3,
                  height: "100%",
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  alignItems={{ xs: "flex-start", md: "center" }}
                  justifyContent="space-between"
                  spacing={2}
                  mb={2}
                >
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      Manager / Team Operating Unit
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {selectedOtherTeam.managerName}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      {selectedOtherTeam.department}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label={`Manager ${selectedOtherTeam.managerName}`} color="primary" variant="outlined" />
                    <Chip label={selectedOtherTeam.leads.length} color="secondary" variant="outlined" />
                  </Stack>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: "#F8FAFC",
                        borderRadius: 3,
                        border: "1px solid #E5E7EB",
                        p: 2.6,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ color: "#475569" }}>
                        Manager Project Allocation
                      </Typography>

                      <Stack spacing={2} sx={{ mt: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Current Project
                          </Typography>
                          <Typography fontWeight={700}>
                            {selectedOtherTeam.currentProject || selectedOtherLead?.project || "Operations"}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Last Project
                          </Typography>
                          <Typography fontWeight={700}>
                            {selectedOtherTeam.lastProject || selectedOtherLead?.lastProject || "Knowledge Automation"}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Department
                          </Typography>
                          <Typography fontWeight={700}>
                            {selectedOtherTeam.department}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={700}>
                          Team Leads
                        </Typography>
                        <Chip label="Lead Network" color="primary" size="small" />
                      </Stack>

                      <Stack spacing={1.4}>
                        {selectedOtherTeam.leads.map((lead) => (
                          <Card
                            key={lead.leadId}
                            onClick={() => {
                              setSelectedOtherLead(lead);
                              setSelectedOtherEmployee(null);
                            }}
                            sx={{
                              borderRadius: 3,
                              cursor: "pointer",
                              border:
                                selectedOtherLead?.leadId === lead.leadId
                                  ? "2px solid #1D4ED8"
                                  : "1px solid #E5E7EB",
                              backgroundColor:
                                selectedOtherLead?.leadId === lead.leadId
                                  ? "#EFF6FF"
                                  : "#FFFFFF",
                              "&:hover": {
                                boxShadow: 2,
                              },
                            }}
                          >
                            <CardContent sx={{ py: 1.6, px: 2.2 }}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                  <Typography fontWeight={700}>{lead.leadName}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    <span style={{ fontWeight: 700 }}>Current:</span> {lead.project}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    <span style={{ fontWeight: 700 }}>Last:</span> {lead.lastProject || "Legacy Knowledge"}
                                  </Typography>
                                </Box>

                                <Stack direction="row" spacing={1}>
                                  <Chip label={`${lead.employees.length} people`} size="small" variant="outlined" />
                                  <Chip label={`Rating ${lead.rating}`} size="small" color="success" variant="outlined" />
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>

                {selectedOtherLead && (
                  <Box sx={{ mt: 3 }}>
                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="h6" fontWeight={700} mb={2}>
                      Employee Workstream
                    </Typography>

                    <Stack spacing={1.4}>
                      {selectedOtherLead.employees.map((employee) => (
                        <Card
                          key={employee.empId}
                          onClick={() => setSelectedOtherEmployee(employee)}
                          sx={{
                            borderRadius: 3,
                            cursor: "pointer",
                            border:
                              selectedOtherEmployee?.empId === employee.empId
                                ? "2px solid #1D4ED8"
                                : "1px solid #E5E7EB",
                            backgroundColor:
                              selectedOtherEmployee?.empId === employee.empId
                                ? "#EFF6FF"
                                : "#FFFFFF",
                            "&:hover": {
                              boxShadow: 2,
                            },
                          }}
                        >
                          <CardContent sx={{ py: 1.6, px: 2.2 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography fontWeight={700}>{employee.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <span style={{ fontWeight: 700 }}>Current:</span> {employee.project}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <span style={{ fontWeight: 700 }}>Last:</span> {employee.lastProject || "Previous Program Rollout"}
                                </Typography>
                              </Box>

                              <Stack direction="row" spacing={1}>
                                <Chip label={`Rating ${employee.rating}`} size="small" color="success" variant="outlined" />
                                <Chip label={employee.department} size="small" variant="outlined" />
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>

                    {selectedOtherEmployee && (
                      <Box sx={{ mt: 3 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            borderRadius: 3,
                            border: "1px solid #94A3B8",
                            backgroundColor: "#0F172A",
                            color: "#FFFFFF",
                            p: 2.6,
                          }}
                        >
                          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2}>
                            <Box>
                              <Typography variant="overline" sx={{ color: "#CBD5E1" }}>
                                Employee Detail
                              </Typography>
                              <Typography variant="h6" fontWeight={700}>
                                {selectedOtherEmployee.name}
                              </Typography>
                            </Box>

                            <Chip label={`Rating ${selectedOtherEmployee.rating}`} color="success" sx={{ color: "#000", backgroundColor: "#BBF7D0" }} />
                          </Stack>

                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6} md={3}>
                              <Typography variant="body2" color="#CBD5E1">Employee ID</Typography>
                              <Typography fontWeight={700}>{selectedOtherEmployee.empId}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <Typography variant="body2" color="#CBD5E1">Department</Typography>
                              <Typography fontWeight={700}>{selectedOtherEmployee.department}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <Typography variant="body2" color="#CBD5E1">Current Project</Typography>
                              <Typography fontWeight={700}>{selectedOtherEmployee.project}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                              <Typography variant="body2" color="#CBD5E1">Last Project</Typography>
                              <Typography fontWeight={700}>{selectedOtherEmployee.lastProject || "Previous Program Rollout"}</Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>
            ) : (
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #E5E7EB" }}>
                <Typography variant="h6">No team selected</Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default UserManagementPage;