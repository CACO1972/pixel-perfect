import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/** /empezar redirects to /evaluacion preserving query params */
const Empezar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    navigate(`/evaluacion${qs ? `?${qs}` : ""}`, { replace: true });
  }, [navigate, searchParams]);

  return null;
};

export default Empezar;
