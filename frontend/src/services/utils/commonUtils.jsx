// common functions

export const getStatusChip = (value) => {
  if (value === "Active") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-green-600/10 px-3 text-center text-sm font-medium text-green-600">
        Active
      </div>
    );
  } else if (value === "Onboarded") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-green-600/10 px-3 text-center text-sm font-medium text-green-600">
        Onboarded
      </div>
    );
  } else if (value === "License Approved") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-green-600/10 px-3 text-center text-sm font-medium text-green-600">
        {value}
      </div>
    );
  } else if (value === "Unfit") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-red-600/10 px-3 text-center text-sm font-medium text-red-600">
        {value}
      </div>
    );
  } else if (value === "Rejected") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-red-600/10 px-3 text-center text-sm font-medium text-red-600">
        {value}
      </div>
    );
  } else if (value === "Onboarding Rejected") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-red-600/10 px-3 text-center text-sm font-medium text-red-600">
        Onboarding Rejected
      </div>
    );
  } else if (value === "Res. License Rejected") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-red-600/10 px-3 text-center text-sm font-medium text-red-600">
        Res. License Rejected
      </div>
    );
  } else if (value === "EXP") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-red-600/10 px-3 text-center text-sm font-medium text-red-600">
        Expired
      </div>
    );
  } else if (value === "Checking Res. License") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-orange-100 px-3 text-center text-sm font-medium text-amber-600">
        Checking Res. License
      </div>
    );
  } else if (value === "EXPS") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-orange-100 px-3 text-center text-sm font-medium text-amber-600">
        Expiring in 60 days
      </div>
    );
  } else if (value === "ACT") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-green-600/10 px-3 text-center text-sm font-medium text-green-600">
        Active
      </div>
    );
  } else if (value?.startsWith("Expiring in")) {
    return (
      <span className="grid h-6 w-min items-center rounded-2xl bg-orange-100 px-3 text-center text-sm font-medium text-amber-600">
        {value}
      </span>
    );
  } else if (value === "Expired") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-red-600/10 px-3 text-center text-sm font-medium text-red-600">
        Expired
      </div>
    );
  } else if (value === "Under Review") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-orange-100 px-3 text-center text-sm font-medium text-amber-600">
        {value}
      </div>
    );
  } else if (value === "Pending") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-orange-100 px-3 text-center text-sm font-medium text-amber-600">
        {value}
      </div>
    );
  } else if (value === "Approved") {
    return (
      <div className="grid h-6 w-min items-center rounded-2xl bg-green-600/10 px-3 text-center text-sm font-medium text-green-600">
        {value}
      </div>
    );
  }
  if (value === "--") {
    return <div className="ml-3">{value}</div>;
  }

  return <span>{value}</span>;
};

export const getStatusLabelForCsv = (code) => {
  switch (code) {
    case "ACT":
      return "Active";
    case "EXP":
      return "Expired";
    case "EXPS":
      return "Expiring in 60 days";
    default:
      return "--";
  }
};
