import styled from "@emotion/styled";
import theme from "../../lib/theme.ts";

export default styled.div`
  border: 1px solid black;
  border-radius: 0.5rem;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      padding: 0.2rem 0.2rem 0.2rem 0.8rem;

      &:not(:first-of-type) {
        border-top: 1px solid black;
      }

      &.active {
        color: ${theme.activeColor};
        font-weight: ${theme.activeFontWeight};
      }

      .title {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex-grow: 1;
      }

      .actions {
        white-space: nowrap;
      }
    }
  }
`;
